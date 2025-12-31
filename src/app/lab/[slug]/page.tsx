import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Column, Flex, Meta, Schema } from "@once-ui-system/core";
import { baseURL, lab, person } from "@/resources";
import { experimentComponents } from "@/components/lab/experiments";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return lab.experiments
    .filter((exp) => exp.status === "successful" || exp.status === "in-progress" || exp.status === "risky")
    .map((exp) => ({ slug: exp.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experiment = lab.experiments.find((exp) => exp.id === slug);

  if (!experiment) return {};

  return Meta.generate({
    title: `${experiment.title} – Lab – ${person.name}`,
    description: experiment.description,
    baseURL: baseURL,
    image: experiment.thumbnail || `/api/og/generate?title=${encodeURIComponent(experiment.title)}`,
    path: `${lab.path}/${slug}`,
  });
}

export default async function LabExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = lab.experiments.find((exp) => exp.id === slug);

  if (!experiment) {
    notFound();
  }

  // Get the component for this experiment
  const ExperimentComponent = experimentComponents[experiment.id];

  if (!ExperimentComponent) {
    notFound();
  }

  return (
    <Flex fillWidth maxWidth="xl" horizontal="center">
      <Column fillWidth maxWidth="l">
        <Schema
          as="webPage"
          baseURL={baseURL}
          title={`${experiment.title} – Lab`}
          description={experiment.description}
          path={`${lab.path}/${slug}`}
          image={experiment.thumbnail || `/api/og/generate?title=${encodeURIComponent(experiment.title)}`}
          author={{
            name: person.name,
            url: `${baseURL}${lab.path}`,
            image: `${baseURL}${person.avatar}`,
          }}
        />
        <ExperimentComponent experiment={experiment} />
      </Column>
    </Flex>
  );
}

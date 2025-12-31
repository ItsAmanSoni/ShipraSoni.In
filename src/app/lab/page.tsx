import { Flex, Meta, Schema } from "@once-ui-system/core";
import LabView from "@/components/lab/LabView";
import { baseURL, lab, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: lab.title,
    description: lab.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(lab.title)}`,
    path: lab.path,
  });
}

export default function Lab() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={lab.title}
        description={lab.description}
        path={lab.path}
        image={`/api/og/generate?title=${encodeURIComponent(lab.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${lab.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <LabView />
    </Flex>
  );
}

"use client";

import { Button, Column, Heading, Input, MasonryGrid, Row, Text, ToggleButton } from "@once-ui-system/core";
import { lab } from "@/resources";
import { useState, useMemo } from "react";
import LabCard from "./LabCard";

type CategoryFilter = "all" | "visual" | "coding" | "animation" | "learning" | "ai";

const ITEMS_PER_PAGE = 20;

export default function LabView() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "visual", label: "Visual" },
    { value: "coding", label: "Coding" },
    { value: "animation", label: "Animation" },
    { value: "learning", label: "Learning" },
    { value: "ai", label: "AI" },
  ];

  const filteredExperiments = useMemo(() => {
    let filtered = lab.experiments;

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter(exp => exp.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredExperiments.length / ITEMS_PER_PAGE);
  const paginatedExperiments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExperiments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExperiments, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Column fillWidth gap="32">
      <Column gap="16">
        <Heading as="h1" variant="display-strong-m">
          Lab
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Visual experiments, coding experiments, animations, and creative learnings.
        </Text>
      </Column>

      {/* Search Input */}
      <Input
        id="lab-search"
        label="Search experiments"
        placeholder="Search by title, description, or tags..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {/* Category Filters */}
      <Row gap="8" wrap>
        {categories.map((category) => (
          <ToggleButton
            key={category.value}
            size="s"
            selected={activeFilter === category.value}
            onClick={() => handleFilterChange(category.value)}
            label={category.label}
          />
        ))}
      </Row>

      {/* Results Count */}
      <Text variant="body-default-s" onBackground="neutral-weak">
        Showing {paginatedExperiments.length} of {filteredExperiments.length} experiments
      </Text>

      {/* Masonry Grid */}
      <MasonryGrid columns={4} s={{ columns: 1 }} m={{ columns: 2 }}>
        {paginatedExperiments.map((experiment, index) => (
          <LabCard
            key={experiment.id}
            experiment={experiment}
            priority={index < 6}
          />
        ))}
      </MasonryGrid>

      {/* Empty State */}
      {filteredExperiments.length === 0 && (
        <Column fillWidth padding="64" horizontal="center" vertical="center">
          <Text variant="body-default-m" onBackground="neutral-weak">
            No experiments found. Try a different search or filter.
          </Text>
        </Column>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Row gap="8" horizontal="center" vertical="center" paddingTop="16">
          <Button
            size="s"
            variant="secondary"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <Row gap="4" vertical="center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="s"
                variant={currentPage === page ? "primary" : "tertiary"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </Row>

          <Button
            size="s"
            variant="secondary"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Row>
      )}
    </Column>
  );
}

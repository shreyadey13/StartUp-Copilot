"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, BriefcaseBusiness, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProjectMutation, useProjectsQuery } from "@/lib/api/hooks";

export function ProjectList() {
  const projects = useProjectsQuery();
  const createProject = useCreateProjectMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createProject.mutateAsync({ name, description });
      setName("");
      setDescription("");
    } catch {
      // React Query exposes the error state below the form.
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="surface-panel">
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>Create a workspace for a startup idea.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleCreate}>
            <div className="grid gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="AI hiring analyst" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <Button type="submit" disabled={!name || createProject.isPending}>
              {createProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create project
            </Button>
            {createProject.error ? (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {createProject.error.message}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {projects.isLoading ? (
          <Card className="surface-panel">
            <CardContent className="flex items-center gap-2 pt-5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading projects...
            </CardContent>
          </Card>
        ) : null}
        {projects.error ? (
          <Card className="surface-panel border-destructive/30">
            <CardContent className="flex items-center gap-2 pt-5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {projects.error.message}
            </CardContent>
          </Card>
        ) : null}
        {projects.data?.items.map((project) => (
          <Card key={project.id} className="surface-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-primary" />
                {project.name}
              </CardTitle>
              <CardDescription>{project.description ?? "No description yet"}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {projects.data?.items.length === 0 ? (
          <Card className="surface-panel">
            <CardContent className="flex items-center gap-2 pt-5 text-sm text-muted-foreground">
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              No projects yet.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

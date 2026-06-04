import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function SettingsForm() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Default operating context for startup analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input id="workspace-name" defaultValue="Founder Workspace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Default market</Label>
            <Select id="region" defaultValue="us">
              <option value="us">United States</option>
              <option value="india">India</option>
              <option value="eu">European Union</option>
            </Select>
          </div>
          <Button className="w-fit">Save settings</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Controls</CardTitle>
          <CardDescription>Quality and cost preferences for agent workflows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="depth">Research depth</Label>
            <Select id="depth" defaultValue="balanced">
              <option value="fast">Fast</option>
              <option value="balanced">Balanced</option>
              <option value="deep">Deep</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="approval">Human approval checkpoint</Label>
            <Select id="approval" defaultValue="financials">
              <option value="idea">Idea interpretation</option>
              <option value="financials">Financial assumptions</option>
              <option value="all">All checkpoints</option>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


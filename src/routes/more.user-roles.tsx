import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Chip,
  Field,
  PrimaryButton,
  Row,
  SectionPage,
  inputClass,
} from "@/components/SectionPage";
import { ROLES, TEAM, type Role } from "@/lib/more-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/user-roles")({
  head: () => ({
    meta: [
      { title: "User roles — BizAnalyst" },
      { name: "description", content: "Decide who can record transactions and who can only view reports." },
      { property: "og:title", content: "User roles — BizAnalyst" },
      { property: "og:description", content: "Manage team members and their permissions." },
    ],
  }),
  component: UserRolesPage,
});

function UserRolesPage() {
  const [team, setTeam] = useState(TEAM);
  const [editing, setEditing] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Sales");

  return (
    <SectionPage title="User roles" subtitle="Team members and what each of them can do.">
      <Card>
        {team.map((m) => (
          <div key={m.id}>
            <Row
              title={m.name}
              meta={m.email}
              onClick={() => setEditing(editing === m.id ? null : m.id)}
              right={<Chip tone={m.role === "Owner" ? "gold" : "blue"}>{m.role}</Chip>}
            />
            {editing === m.id && (
              <div className="flex flex-wrap gap-2 border-b bg-paper-50 px-4 py-3">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setTeam((prev) => prev.map((x) => (x.id === m.id ? { ...x, role: r } : x)));
                      setEditing(null);
                      toast.success(`${m.name} is now ${r}`);
                    }}
                    className={cn(
                      "min-h-9 rounded-full px-4 text-xs font-medium transition-opacity active:opacity-80",
                      m.role === r ? "bg-blue-900 text-primary-foreground" : "bg-card text-charcoal-500",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </Card>

      {inviting ? (
        <Card className="space-y-3 p-4">
          <Field label="Email address">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <div>
            <span className="block text-xs font-medium text-muted-foreground">Role</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLES.filter((r) => r !== "Owner").map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "min-h-9 rounded-full px-4 text-xs font-medium transition-opacity active:opacity-80",
                    role === r ? "bg-blue-900 text-primary-foreground" : "bg-paper-100 text-charcoal-500",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <PrimaryButton
            onClick={() => {
              if (!email.trim()) return;
              setTeam((prev) => [...prev, { id: `${Date.now()}`, name: email.split("@")[0] ?? email, email, role }]);
              setEmail("");
              setInviting(false);
              toast.success("Invitation sent");
            }}
          >
            Send invite
          </PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setInviting(true)}>
          <UserPlus className="h-4 w-4" aria-hidden /> Invite user
        </PrimaryButton>
      )}
    </SectionPage>
  );
}

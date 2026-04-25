import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageContainer } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/common/page-elements";
import { Button } from "@/components/ui/button";
import { mockTeamUsers } from "@/lib/mock-data";
import { format } from "date-fns";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Team & sessions"
          description="Manage workspace members and view their activity."
          action={
            <Button>
              <UserPlus className="h-4 w-4" />
              Invite member
            </Button>
          }
        />

        <div className="hover-radius mt-10 border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Requests (30d)</th>
              </tr>
            </thead>
            <tbody>
              {mockTeamUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover-radius border-b border-border last:border-0 hover:bg-secondary/40"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center bg-secondary text-xs font-semibold">
                        {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex border px-2.5 py-1 text-xs font-medium capitalize",
                        u.role === "admin" && "border-primary bg-primary/40 text-foreground",
                        u.role === "developer" && "border-border bg-secondary text-foreground",
                        u.role === "viewer" && "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground">
                    {format(new Date(u.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-5 text-right text-foreground">
                    {(800 + Math.floor(Math.random() * 4200)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </AppShell>
  );
}

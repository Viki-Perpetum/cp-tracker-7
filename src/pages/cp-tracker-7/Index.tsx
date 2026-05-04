import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, Clock, XCircle, Search, Eye, Building2, FileText, Banknote } from "lucide-react";

type Status = "Completed" | "In Progress" | "At Risk" | "Blocked";

interface CPRecord {
  id: string;
  cp: string;
  contractor: string;
  milestone: string;
  dueDate: string;
  docRequired: string;
  docStatus: "Received" | "Pending" | "Missing";
  financeCondition: string;
  financeStatus: "Cleared" | "Pending" | "Blocked";
  overallStatus: Status;
  owner: string;
  notes: string;
}

const DATA: CPRecord[] = [
  { id: "1", cp: "CP-01", contractor: "Heijmans NV", milestone: "Foundation Complete", dueDate: "2024-03-15", docRequired: "Inspection Certificate", docStatus: "Received", financeCondition: "FC-A: Site Clearance", financeStatus: "Cleared", overallStatus: "Completed", owner: "Marc Dubois", notes: "All conditions met. Drawdown approved." },
  { id: "2", cp: "CP-02", contractor: "BAM Contractors", milestone: "Structural Frame", dueDate: "2024-05-20", docRequired: "Engineer Sign-off", docStatus: "Pending", financeCondition: "FC-B: Frame Certification", financeStatus: "Pending", overallStatus: "In Progress", owner: "Sofie Leclercq", notes: "Engineer review scheduled for May 12." },
  { id: "3", cp: "CP-03", contractor: "Besix Group", milestone: "MEP Rough-In", dueDate: "2024-05-28", docRequired: "MEP Compliance Report", docStatus: "Missing", financeCondition: "FC-C: MEP Approval", financeStatus: "Blocked", overallStatus: "Blocked", owner: "Jan Verstraeten", notes: "Contractor has not submitted MEP report. Escalation needed." },
  { id: "4", cp: "CP-04", contractor: "CFE Construct", milestone: "Facade Installation", dueDate: "2024-06-10", docRequired: "Warranty & Insurance", docStatus: "Pending", financeCondition: "FC-D: Facade Completion", financeStatus: "Pending", overallStatus: "At Risk", owner: "Laura Maes", notes: "Material delivery delayed by 2 weeks. Deadline at risk." },
  { id: "5", cp: "CP-05", contractor: "Strabag Belgium", milestone: "Roofing & Waterproofing", dueDate: "2024-07-01", docRequired: "Waterproofing Certificate", docStatus: "Pending", financeCondition: "FC-E: Roofing Sign-off", financeStatus: "Pending", overallStatus: "In Progress", owner: "Pierre Fontaine", notes: "On track. Inspection booked for June 28." },
  { id: "6", cp: "CP-06", contractor: "Heijmans NV", milestone: "Interior Fit-Out", dueDate: "2024-07-20", docRequired: "Fit-Out Completion Cert", docStatus: "Missing", financeCondition: "FC-F: Interior Approval", financeStatus: "Blocked", overallStatus: "Blocked", owner: "Marc Dubois", notes: "Subcontractor dispute unresolved. Legal review pending." },
  { id: "7", cp: "CP-07", contractor: "BAM Contractors", milestone: "Final Commissioning", dueDate: "2024-08-15", docRequired: "Commissioning Report", docStatus: "Pending", financeCondition: "FC-G: Final Drawdown", financeStatus: "Pending", overallStatus: "In Progress", owner: "Sofie Leclercq", notes: "Pre-commissioning checklist 60% complete." }
];

const statusConfig: Record<Status, { color: string; icon: React.ReactNode }> = {
  Completed: { color: "bg-emerald-500/15 text-emerald-600 border-emerald-300", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  "In Progress": { color: "bg-blue-500/15 text-blue-600 border-blue-300", icon: <Clock className="w-3.5 h-3.5" /> },
  "At Risk": { color: "bg-amber-500/15 text-amber-600 border-amber-300", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Blocked: { color: "bg-red-500/15 text-red-600 border-red-300", icon: <XCircle className="w-3.5 h-3.5" /> }
};

const docBadge: Record<string, string> = {
  Received: "bg-emerald-500/15 text-emerald-600 border-emerald-300",
  Pending: "bg-amber-500/15 text-amber-600 border-amber-300",
  Missing: "bg-red-500/15 text-red-600 border-red-300"
};

const financeBadge: Record<string, string> = {
  Cleared: "bg-emerald-500/15 text-emerald-600 border-emerald-300",
  Pending: "bg-amber-500/15 text-amber-600 border-amber-300",
  Blocked: "bg-red-500/15 text-red-600 border-red-300"
};

export default function CpTracker() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<CPRecord | null>(null);

  const filtered = useMemo(() => {
    return DATA.filter(r => {
      const matchSearch = [r.cp, r.contractor, r.milestone, r.owner].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === "all" || r.overallStatus.toLowerCase().replace(" ", "-") === tab;
      return matchSearch && matchTab;
    });
  }, [search, tab]);

  const counts = useMemo(() => ({
    total: DATA.length,
    blocked: DATA.filter(r => r.overallStatus === "Blocked").length,
    atRisk: DATA.filter(r => r.overallStatus === "At Risk").length,
    completed: DATA.filter(r => r.overallStatus === "Completed").length,
    missingDocs: DATA.filter(r => r.docStatus === "Missing").length
  }), []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CP Milestone & Drawdown Tracker</h1>
        <p className="text-muted-foreground mt-1">Unified view of Construction Package status, Belfius financing conditions, and contractor deliverables.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />Total CPs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-foreground">{counts.total}</p></CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-red-500" />Blocked</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-red-500">{counts.blocked}</p></CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />At Risk</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-amber-500">{counts.atRisk}</p></CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-1 pt-4 px-4"><CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-red-500" />Missing Docs</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-3xl font-bold text-red-500">{counts.missingDocs}</p></CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-base font-semibold">Construction Package Register</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search CP, contractor, owner..." className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3">All ({DATA.length})</TabsTrigger>
              <TabsTrigger value="blocked" className="text-xs px-3">Blocked ({counts.blocked})</TabsTrigger>
              <TabsTrigger value="at-risk" className="text-xs px-3">At Risk ({counts.atRisk})</TabsTrigger>
              <TabsTrigger value="in-progress" className="text-xs px-3">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs px-3">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="w-16 pl-4">CP</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Finance Cond.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-10">No records match your search.</TableCell></TableRow>
              )}
              {filtered.map(row => (
                <TableRow key={row.id} className="border-border hover:bg-muted/40 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold pl-4">{row.cp}</TableCell>
                  <TableCell className="text-sm">{row.contractor}</TableCell>
                  <TableCell className="text-sm">{row.milestone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.dueDate}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs gap-1 ${docBadge[row.docStatus]}`}>{row.docStatus}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs gap-1 ${financeBadge[row.financeStatus]}`}><Banknote className="w-3 h-3" />{row.financeStatus}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs flex items-center gap-1 w-fit ${statusConfig[row.overallStatus].color}`}>{statusConfig[row.overallStatus].icon}{row.overallStatus}</Badge></TableCell>
                  <TableCell className="text-right pr-4"><Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setSelected(row)}><Eye className="w-3.5 h-3.5 mr-1" />View</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-primary">{selected?.cp}</span>
              <span className="text-foreground">— {selected?.milestone}</span>
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs mb-0.5">Contractor</p><p className="font-medium">{selected.contractor}</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Owner</p><p className="font-medium">{selected.owner}</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Due Date</p><p className="font-medium">{selected.dueDate}</p></div>
                <div><p className="text-muted-foreground text-xs mb-0.5">Overall Status</p><Badge variant="outline" className={`text-xs gap-1 ${statusConfig[selected.overallStatus].color}`}>{statusConfig[selected.overallStatus].icon}{selected.overallStatus}</Badge></div>
              </div>
              <div className="border border-border rounded-md p-3 space-y-2">
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Document Requirement</p>
                <div className="flex items-center justify-between">
                  <span>{selected.docRequired}</span>
                  <Badge variant="outline" className={`text-xs ${docBadge[selected.docStatus]}`}>{selected.docStatus}</Badge>
                </div>
              </div>
              <div className="border border-border rounded-md p-3 space-y-2">
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Belfius Financing Condition</p>
                <div className="flex items-center justify-between">
                  <span>{selected.financeCondition}</span>
                  <Badge variant="outline" className={`text-xs ${financeBadge[selected.financeStatus]}`}>{selected.financeStatus}</Badge>
                </div>
              </div>
              <div className="border border-border rounded-md p-3">
                <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                <p className="text-foreground">{selected.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import { WorkItem, WorkItemType, Person } from "@/types";
import { formatDate } from "@/utils/date";

/* ---------- props ---------- */
interface WorkItemListProps {
    workItems: WorkItem[];
    personMap: Record<number, Person>;
    onAddWorkItem?: () => void;
    onEditWorkItem?: (w: WorkItem) => void;
}

/* ---------- helper ---------- */
const typeMeta: Record<WorkItemType, { cls: string; icon: string }> = {
    STORY: { cls: "bg-blue-100 text-blue-800", icon: "📖" },
    TASK: { cls: "bg-green-100 text-green-800", icon: "✅" },
    BUG: { cls: "bg-red-100 text-red-800", icon: "🐛" },
};

export function WorkItemList({
                                 workItems,
                                 personMap,
                                 onAddWorkItem,
                                 onEditWorkItem,
                             }: WorkItemListProps) {
    /* ---------- filter ---------- */
    const [filterType, setFilterType] = useState<WorkItemType | "ALL">("ALL");

    const filtered =
        filterType === "ALL"
            ? workItems
            : workItems.filter((w) => w.type === filterType);

    const sorted = [...filtered].sort((a, b) => {
        const p: Record<WorkItemType, number> = { STORY: 1, TASK: 2, BUG: 3 };
        return p[a.type] - p[b.type];
    });

    /* ---------- render ---------- */
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Items</CardTitle>
                <div className="flex items-center gap-2">
                    <Select
                        value={filterType}
                        onValueChange={(v) => setFilterType(v as WorkItemType | "ALL")}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="STORY">📖 Story</SelectItem>
                            <SelectItem value="TASK">✅ Task</SelectItem>
                            <SelectItem value="BUG">🐛 Bug</SelectItem>
                        </SelectContent>
                    </Select>
                    {onAddWorkItem && (
                        <Button onClick={onAddWorkItem} size="sm">
                            <Plus className="h-4 w-4 mr-1" /> Add Work Item
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {sorted.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            {filterType === "ALL"
                                ? "No work items found for this epic."
                                : `No ${filterType.toLowerCase()} items found for this epic.`}
                        </p>
                        {onAddWorkItem && (
                            <Button onClick={onAddWorkItem}>
                                <Plus className="h-4 w-4 mr-2" /> Add Work Item
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Assignees</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Deps</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sorted.map((w) => {
                                    const assigneeNames = (w.assignees ?? [])
                                        .map((id) => personMap[id]?.name ?? "Unknown")
                                        .join(", ");

                                    const deps = (w.dependencies ?? []).join(", ");
                                    const { cls, icon } = typeMeta[w.type];

                                    return (
                                        <TableRow
                                            key={w.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => onEditWorkItem?.(w)}
                                        >
                                            <TableCell className="font-medium">{w.id}</TableCell>
                                            <TableCell className="font-medium">{w.title}</TableCell>
                                            <TableCell>
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}`}
                        >
                          <span className="mr-1">{icon}</span>
                            {w.type}
                        </span>
                                            </TableCell>
                                            <TableCell>{assigneeNames || "Unassigned"}</TableCell>
                                            <TableCell>{formatDate(w.startDate)}</TableCell>
                                            <TableCell>{formatDate(w.endDate)}</TableCell>
                                            <TableCell>{deps || "-"}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

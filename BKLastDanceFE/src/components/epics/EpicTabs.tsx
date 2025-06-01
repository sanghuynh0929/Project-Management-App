import React, { useMemo } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import type { Person, Sprint } from "@/types";
import { useEpic } from "@/hooks/useEpic";
import {WorkItemList} from "@/components/epics/WorkItemList.tsx";

interface EpicTabsProps {
    epicId: number;
    onEditWorkItem?: (w: any) => void;
    onAddWorkItem?: () => void;
}

export const EpicTabs: React.FC<EpicTabsProps> = ({
                                                      epicId,
                                                      onEditWorkItem,
                                                      onAddWorkItem,
                                                  }) => {
    /* ------------ fetch all epic‑related data ------------ */
    const {
        epic,
        workItems,
        allocations,
        costs,
        sprints,
        personMap,
        sprintMap,
        isLoading,
    } = useEpic(epicId);

    /* helper: total cost */
    const totalCost = useMemo(
        () => costs.reduce((sum, c) => sum + c.amount, 0),
        [costs],
    );

    if (!epic) return null; // should not happen – parent already checks

    return (
        <Tabs defaultValue="workitems">
            <TabsList className="mb-4">
                <TabsTrigger value="workitems">Work Items</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            {/* ---------------- Work Items ---------------- */}
            <TabsContent value="workitems">
                {/* WorkItemList is already on canvas, import path stays the same */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <WorkItemList
                    workItems={workItems}
                    personMap={personMap}
                    onEditWorkItem={onEditWorkItem}
                    onAddWorkItem={onAddWorkItem}
                />
            </TabsContent>

            {/* ---------------- Resources ---------------- */}
            <TabsContent value="resources">
                <Card className="p-6">
                    {isLoading ? (
                        <Skeleton className="h-32 w-full" />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Team member</TableHead>
                                    <TableHead>Sprint</TableHead>
                                    <TableHead className="text-center">FTE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allocations.map((a, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{personMap[a.personId]?.name ?? "Unknown"}</TableCell>
                                        <TableCell>{sprintMap[a.sprintId]?.name ?? "Unknown"}</TableCell>
                                        <TableCell className="text-center">{a.fte.toFixed(1)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </TabsContent>

            {/* ---------------- Costs ---------------- */}
            <TabsContent value="costs">
                <Card className="p-6">
                    {isLoading ? (
                        <Skeleton className="h-32 w-full" />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Sprint</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {costs.map((c, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{sprintMap[c.sprintId]?.name ?? "Unknown"}</TableCell>
                                        <TableCell className="text-right">${c.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/50">
                                    <TableCell colSpan={2} className="font-medium">
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${totalCost.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </TabsContent>

            {/* ---------------- Timeline ---------------- */}
            <TabsContent value="timeline">
                <Card className="p-6">
                    {isLoading ? (
                        <Skeleton className="h-32 w-full" />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Work Item</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Assignees</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Dependencies</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workItems.map((wi) => {
                                    const assigneeNames = (wi.assignees ?? [])
                                        .map((id) => personMap[id]?.name ?? "Unknown")
                                        .join(", ");
                                    return (
                                        <TableRow key={wi.id}>
                                            <TableCell className="font-medium">{wi.title}</TableCell>
                                            <TableCell>{wi.type}</TableCell>
                                            <TableCell>{assigneeNames || "Unassigned"}</TableCell>
                                            <TableCell>
                                                {new Date(wi.startDate).toLocaleDateString("vi-VN")}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(wi.endDate).toLocaleDateString("vi-VN")}
                                            </TableCell>
                                            <TableCell>
                                                {(wi.dependencies ?? []).length > 0
                                                    ? wi.dependencies?.join(", ")
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {workItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No work items found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </TabsContent>
        </Tabs>
    );
};

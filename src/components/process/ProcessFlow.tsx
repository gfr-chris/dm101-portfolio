"use client";

import { useMemo, useState } from "react";
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Edge, type Node, type NodeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

type Role = "Visitor" | "System" | "Owner";

interface StepData extends Record<string, unknown> {
  label: string;
  role: Role;
  step?: number;
  problem?: string;
  kind?: "step" | "decision" | "end";
}

const roleColor: Record<Role, string> = {
  Visitor: "border-accent-2/60 text-accent-2",
  System: "border-indigo/60 text-indigo",
  Owner: "border-accent/60 text-accent",
};

function StepNode({ data }: NodeProps<Node<StepData>>) {
  const d = data;
  if (d.kind === "decision") {
    return (
      <div className="relative grid h-[104px] w-[150px] place-items-center">
        <Handle type="target" position={Position.Left} className="!bg-line" />
        <div className="absolute inset-0 border border-warn/70 bg-surface-2" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
        <span className="relative px-6 text-center text-[11px] leading-tight text-warn">{d.label}</span>
        <Handle type="source" position={Position.Right} id="yes" className="!bg-line" />
        <Handle type="source" position={Position.Top} id="no" className="!bg-line" />
      </div>
    );
  }
  return (
    <div className={cn("w-[190px] rounded-lg border bg-surface-2 px-3 py-2 shadow", roleColor[d.role], d.kind === "end" && "rounded-full text-center")}>
      <Handle type="target" position={Position.Left} className="!bg-line" />
      <Handle type="target" position={Position.Bottom} id="back" className="!bg-line" />
      {d.step != null && <span className="mb-0.5 block font-mono text-[10px] opacity-70">STEP {d.step} · {d.role.toUpperCase()}</span>}
      <span className="block text-[12px] leading-snug text-fg">{d.label}</span>
      {d.problem && <span className="mt-1.5 block border-t border-danger/30 pt-1 text-[10.5px] italic leading-snug text-danger">⚠ {d.problem}</span>}
      <Handle type="source" position={Position.Right} className="!bg-line" />
    </div>
  );
}

function LaneNode({ data }: NodeProps<Node<{ label: string; w: number }>>) {
  return (
    <div className="pointer-events-none flex h-[120px] items-center border-t border-dashed border-line pl-1 font-mono text-[11px] uppercase tracking-widest text-muted" style={{ width: data.w }}>
      {data.label}
    </div>
  );
}

const nodeTypes = { step: StepNode, lane: LaneNode };

const laneY: Record<Role, number> = { Visitor: 20, System: 160, Owner: 300 };
const X0 = 130;
const GAP = 235;

function step(id: string, col: number, role: Role, label: string, extra: Partial<StepData> = {}): Node<StepData> {
  const decision = extra.kind === "decision";
  return {
    id,
    type: "step",
    position: { x: X0 + col * GAP, y: laneY[role] + (decision ? 8 : 0) },
    data: { label, role, ...extra },
    draggable: false,
  };
}

function lanes(roles: Role[], width: number): Node[] {
  return roles.map((r) => ({
    id: `lane-${r}`,
    type: "lane",
    position: { x: 0, y: laneY[r] - 12 },
    data: { label: r, w: width },
    draggable: false,
    selectable: false,
    zIndex: -1,
  }));
}

const edgeBase = { markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#4b6075" } } as const;
const e = (id: string, source: string, target: string, extra: Partial<Edge> = {}): Edge => ({ id, source, target, ...edgeBase, ...extra });

function buildAsIs() {
  const nodes: Node[] = [
    ...lanes(["Visitor", "Owner"], 1300),
    step("a1", 0, "Visitor", "Search social profiles / scattered documents", { step: 1, problem: "Information is fragmented" }),
    step("a2", 1, "Visitor", "Send informal message (social / email)", { step: 2, problem: "Missing details, no category" }),
    step("a3", 2, "Owner", "Receive and manually interpret request", { step: 3, problem: "Hard to organize / prioritize" }),
    step("a4", 3, "Owner", "Search message history and reply", { step: 4, problem: "Status not tracked" }),
    step("a5", 4, "Owner", "Consider request finished", { step: 5, problem: "No central record or data", kind: "end" }),
  ];
  // lanes for As-Is use only Visitor + Owner, so move Owner nodes up to the 2nd lane
  nodes.forEach((n) => {
    if (n.type === "step" && (n.data as StepData).role === "Owner") n.position.y = laneY.System + 8;
    if (n.id === "lane-Owner") n.position.y = laneY.System - 12;
  });
  const edges = [e("a1-a2", "a1", "a2"), e("a2-a3", "a2", "a3"), e("a3-a4", "a3", "a4"), e("a4-a5", "a4", "a5")];
  return { nodes, edges, height: 330 };
}

function buildToBe() {
  const nodes: Node[] = [
    ...lanes(["Visitor", "System", "Owner"], 1500),
    step("b1", 0, "Visitor", "Review profile, skills and projects", { step: 1 }),
    step("b2", 1, "Visitor", "Choose inquiry type, fill required fields", { step: 2 }),
    step("b3", 2, "System", "Input valid?", { kind: "decision", step: 3 }),
    step("b4", 3, "System", "Store inquiry with timestamp, status “New”", { step: 4 }),
    step("b5", 4, "Visitor", "Receive confirmation", { step: 5 }),
    step("b6", 4, "Owner", "Review inquiry; update status (In Review → Responded / Closed)", { step: 6 }),
    step("b7", 5, "System", "Record status history + timestamps for KPIs", { step: 7 }),
  ];
  const edges: Edge[] = [
    e("b1-b2", "b1", "b2"),
    e("b2-b3", "b2", "b3"),
    e("b3-b4", "b3", "b4", { sourceHandle: "yes", label: "Yes", labelStyle: { fill: "#8b9bab", fontSize: 11 }, labelBgStyle: { fill: "#0a0f14" } }),
    e("b3-b2", "b3", "b2", { sourceHandle: "no", targetHandle: "back", label: "No — return for correction", labelStyle: { fill: "#fbbf24", fontSize: 11 }, labelBgStyle: { fill: "#0a0f14" }, style: { stroke: "#fbbf24", strokeDasharray: "5 4" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#fbbf24" } }),
    e("b4-b5", "b4", "b5"),
    e("b4-b6", "b4", "b6"),
    e("b6-b7", "b6", "b7"),
  ];
  return { nodes, edges, height: 470 };
}

export function ProcessFlow() {
  const [view, setView] = useState<"asis" | "tobe">("tobe");
  const flow = useMemo(() => (view === "asis" ? buildAsIs() : buildToBe()), [view]);

  return (
    <div>
      <div role="tablist" aria-label="Process view" className="mb-3 inline-flex rounded-lg border border-line bg-surface p-1 text-sm">
        {([["asis", "As-Is (informal)"], ["tobe", "To-Be (website workflow)"]] as const).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={cn("rounded-md px-3 py-1.5", view === key ? "bg-surface-2 text-accent" : "text-muted hover:text-fg")}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-bg" style={{ height: flow.height }}>
        <ReactFlow
          key={view}
          nodes={flow.nodes}
          edges={flow.edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          preventScrolling={false}
          minZoom={0.3}
          proOptions={{ hideAttribution: true }}
          aria-label={view === "asis" ? "As-Is process diagram" : "To-Be process diagram"}
        >
          <Background gap={24} color="#16202b" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <p className="mt-2 text-xs text-muted">A visual process model (not a BPMN execution engine). Use the controls or pinch to zoom; the table below describes each step in text.</p>
    </div>
  );
}

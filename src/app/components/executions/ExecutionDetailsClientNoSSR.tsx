"use client";

import dynamic from "next/dynamic";
import type { ExecutionListItem } from "@domain/test-results/types";

// Importa dinamicamente com SSR desativado
const ExecutionDetailsClient = dynamic(
  () => import("./ExecutionDetailsClient"),
  { ssr: false }
);

interface ExecutionDetailsClientNoSSRProps {
  execution: ExecutionListItem;
}

export default function ExecutionDetailsClientNoSSR(props: ExecutionDetailsClientNoSSRProps) {
  return <ExecutionDetailsClient {...props} />;
}

import { SlotContextWrapper } from "@/context/SlotContext";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <SlotContextWrapper>{children}</SlotContextWrapper>;
}

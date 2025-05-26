import { MouseEventHandler } from "react";

export type ModalState = {
  isOpen?: boolean;
  title: string;
  content: React.ReactNode;
  className?: string;
};

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  titleAction: string;
  handleAction: MouseEventHandler<Element>;
}

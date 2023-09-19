/**
 * Type describing available languages
 */
export type Language = "fi" | "en";

/**
 * NavButtonProps
 */
export interface NavButtonProps {
  text: string;
  selected: boolean;
  sx_props?: object;
}

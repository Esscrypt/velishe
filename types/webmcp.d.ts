import "react";

declare module "react" {
  interface FormHTMLAttributes<T extends HTMLElement> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: boolean | "";
  }

  interface InputHTMLAttributes<T extends HTMLElement> {
    toolparamdescription?: string;
  }

  interface TextareaHTMLAttributes<T extends HTMLElement> {
    toolparamdescription?: string;
  }

  interface SelectHTMLAttributes<T extends HTMLElement> {
    toolparamdescription?: string;
  }
}

"use client";

import React from "react";
import { FormField } from "@/types";
import { FieldWrapper } from "./fields/FieldWrapper";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { SelectField } from "./fields/SelectField";
import { RadioField } from "./fields/RadioField";
import { MultiCheckboxField } from "./fields/MultiCheckboxField";
import { BooleanField } from "./fields/BooleanField";

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  allValues: Record<string, any>;
}

export function FieldRenderer({
  field,
  value,
  onChange,
  error,
  allValues,
}: FieldRendererProps) {
  const hasError = Boolean(error);

  const renderControl = () => {
    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      case "textarea":
        return (
          <TextareaField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      case "select":
        return (
          <SelectField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      case "radio":
        return (
          <RadioField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      case "multi_checkbox":
        return (
          <MultiCheckboxField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      case "boolean":
        return (
          <BooleanField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
      default:
        return (
          <TextField
            field={field}
            value={value}
            onChange={onChange}
            hasError={hasError}
          />
        );
    }
  };

  return (
    <FieldWrapper field={field} error={error} allValues={allValues}>
      {renderControl()}
    </FieldWrapper>
  );
}

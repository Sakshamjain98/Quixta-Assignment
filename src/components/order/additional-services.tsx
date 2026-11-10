import type { UseFormRegisterReturn } from "react-hook-form";
import { SERVICE_OPTIONS } from "@/constants/product";
import { formatAddOnPrice } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";

interface AdditionalServicesProps {
  assemblyField: UseFormRegisterReturn<"assembly">;
  hardwareKitField: UseFormRegisterReturn<"hardwareKit">;
  isAssemblyAvailable: boolean;
  assemblyError?: string;
}

export function AdditionalServices({
  assemblyField,
  hardwareKitField,
  isAssemblyAvailable,
  assemblyError,
}: AdditionalServicesProps) {
  const { assembly, hardwareKit } = SERVICE_OPTIONS;

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">
        Additional services <span className="font-normal text-muted">· optional</span>
      </legend>
      <div className="grid gap-3">
        <div>
          <OptionCard
            id="service-assembly"
            type="checkbox"
            title={assembly.label}
            description={isAssemblyAvailable ? assembly.description : "Available with delivery only."}
            price={formatAddOnPrice(assembly.price)}
            disabled={!isAssemblyAvailable}
            aria-invalid={assemblyError ? true : undefined}
            {...assemblyField}
          />
          <FieldError id="assembly-error" message={assemblyError} />
        </div>
        <OptionCard
          id="service-hardware-kit"
          type="checkbox"
          title={hardwareKit.label}
          description={hardwareKit.description}
          price={formatAddOnPrice(hardwareKit.price)}
          {...hardwareKitField}
        />
      </div>
    </fieldset>
  );
}

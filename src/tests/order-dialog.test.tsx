import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { OrderDialog } from "@/components/order/order-dialog";

async function openOrderDialog() {
  const user = userEvent.setup();
  render(<OrderDialog />);
  await user.click(screen.getByRole("button", { name: "Add to order" }));
  const dialog = within(await screen.findByRole("dialog"));
  return { user, dialog };
}

describe("Order dialog", () => {
  it("shows a $275 total for Delivery + Assembly + Hardware kit", async () => {
    const { user, dialog } = await openOrderDialog();

    await user.click(dialog.getByRole("radio", { name: "Delivery" }));
    await user.click(dialog.getByRole("checkbox", { name: "Assembly" }));
    await user.click(dialog.getByRole("checkbox", { name: "Hardware kit" }));

    expect(dialog.getByTestId("order-total")).toHaveTextContent("$275");
  });

  it("clears and disables Assembly when switching to Pickup, and leaves it out of the confirmation", async () => {
    const { user, dialog } = await openOrderDialog();

    await user.click(dialog.getByRole("radio", { name: "Delivery" }));
    await user.click(dialog.getByRole("checkbox", { name: "Assembly" }));
    await user.click(dialog.getByRole("radio", { name: "Pickup" }));

    const assembly = dialog.getByRole("checkbox", { name: "Assembly" });
    expect(assembly).not.toBeChecked();
    expect(assembly).toBeDisabled();
    expect(dialog.getByTestId("order-total")).toHaveTextContent("$180");

    await user.click(dialog.getByRole("checkbox", { name: "Hardware kit" }));
    await user.click(dialog.getByRole("button", { name: "Add to order" }));

    expect(await dialog.findByRole("heading", { name: "Added to your order" })).toBeInTheDocument();
    expect(dialog.getByText("Pickup")).toBeInTheDocument();
    expect(dialog.getByText("Hardware kit")).toBeInTheDocument();
    expect(dialog.getByTestId("order-total")).toHaveTextContent("$210");
    expect(dialog.queryByText(/assembly/i)).not.toBeInTheDocument();
  });

  it("shows a field error and stays open when submitted without fulfillment", async () => {
    const { user, dialog } = await openOrderDialog();

    await user.click(dialog.getByRole("button", { name: "Add to order" }));

    expect(await dialog.findByRole("alert")).toHaveTextContent("Choose pickup or delivery");
    expect(dialog.getByRole("group", { name: /fulfillment/i })).toHaveAccessibleDescription("Choose pickup or delivery");
    expect(dialog.queryByRole("heading", { name: "Added to your order" })).not.toBeInTheDocument();
  });

  it("resets the form after Back to product", async () => {
    const { user, dialog } = await openOrderDialog();

    await user.click(dialog.getByRole("radio", { name: "Pickup" }));
    await user.click(dialog.getByRole("button", { name: "Add to order" }));
    await user.click(await dialog.findByRole("button", { name: "Back to product" }));

    await user.click(screen.getByRole("button", { name: "Add to order" }));
    const reopened = within(await screen.findByRole("dialog"));
    expect(reopened.getByRole("radio", { name: "Pickup" })).not.toBeChecked();
    expect(reopened.getByTestId("order-total")).toHaveTextContent("$180");
  });
});

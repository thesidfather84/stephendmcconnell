import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Jane Visitor");
  await user.type(screen.getByLabelText("Email"), "jane@example.com");
  await user.type(screen.getByLabelText("Subject"), "A question about niacin research");
  await user.type(screen.getByLabelText("Message"), "This is a test message.");
  await user.click(screen.getByLabelText(/I understand that this contact form/));
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders all required and optional fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Contact Method/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason for Contacting/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeInTheDocument();
  });

  it("does not submit when required fields are missing", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not submit with an invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Visitor");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Subject"), "Subject");
    await user.type(screen.getByLabelText("Message"), "Message body");
    await user.click(screen.getByLabelText(/I understand that this contact form/));
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not submit when the consent checkbox is unchecked", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Visitor");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Subject"), "Subject");
    await user.type(screen.getByLabelText("Message"), "Message body");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits successfully and shows a confirmation message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText("Thank you for reaching out.")).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("shows an error message and preserves typed data when submission fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: [{ message: "Server error." }] }),
    });

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Server error.");
    });

    expect(screen.getByLabelText("Name")).toHaveValue("Jane Visitor");
    expect(screen.getByLabelText("Message")).toHaveValue("This is a test message.");
  });

  it("disables the button and prevents duplicate submissions while sending", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValidForm(user);

    const button = screen.getByRole("button", { name: "Send Message" });
    await user.click(button);
    await user.click(button); // second click while still "submitting"
    await user.click(button); // third click

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();

    resolveFetch({ ok: true, json: async () => ({ ok: true }) });
    await waitFor(() => {
      expect(screen.getByText("Thank you for reaching out.")).toBeInTheDocument();
    });
  });
});

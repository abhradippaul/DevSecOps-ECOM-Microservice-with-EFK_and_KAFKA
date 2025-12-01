"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

const FormInput: {
  name: keyof FormValues;
  label: string;
  description?: string;
}[] = [
  {
    name: "fullName",
    label: "Full Name",
    description: "Enter user full name.",
  },
  {
    name: "email",
    label: "Email",
    description: "Only admin can see your email.",
  },
  {
    name: "phone",
    label: "Phone",
    description: "Only admin can see your phone number (optional)",
  },
  {
    name: "address",
    label: "Address",
    description: "Enter user address (optional)",
  },
  {
    name: "city",
    label: "City",
    description: "Enter user city (optional)",
  },
];

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters!" })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10).max(15),
  address: z.string().min(2),
  city: z.string().min(2),
});

const AddUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add User</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form className="space-y-8">
              {FormInput.map(({ name, label, description }) => (
                <FormField
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddUser;

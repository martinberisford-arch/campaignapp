"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  month: z.string().min(1),
  facebookFollowers: z.coerce.number().min(0),
  facebookEngagement: z.coerce.number().min(0).optional(),
  sessionsDelivered: z.coerce.number().min(0),
  familiesAttendingSessions: z.coerce.number().min(0),
  volunteerCount: z.coerce.number().min(0),
  fundingApplicationsSubmitted: z.coerce.number().min(0),
  fundingAwarded: z.coerce.number().min(0)
});

type FormValues = z.infer<typeof schema>;

export function MetricsForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form
      className="grid md:grid-cols-4 gap-3"
      onSubmit={handleSubmit(async (values) => {
        await fetch("/api/metrics", { method: "POST", body: JSON.stringify(values) });
        reset();
        router.refresh();
      })}
    >
      <input type="month" {...register("month")} />
      <input type="number" placeholder="Facebook followers" {...register("facebookFollowers")} />
      <input type="number" placeholder="Facebook engagement" {...register("facebookEngagement")} />
      <input type="number" placeholder="Sessions delivered" {...register("sessionsDelivered")} />
      <input type="number" placeholder="Families attending" {...register("familiesAttendingSessions")} />
      <input type="number" placeholder="Volunteer count" {...register("volunteerCount")} />
      <input type="number" placeholder="Funding applications" {...register("fundingApplicationsSubmitted")} />
      <input type="number" step="0.01" placeholder="Funding awarded (£)" {...register("fundingAwarded")} />
      {(errors.month || errors.facebookFollowers) && <p className="text-red-600 text-sm md:col-span-4">Please complete required fields.</p>}
      <button disabled={isSubmitting} className="bg-primary text-white text-lg md:col-span-4">Save monthly metrics</button>
    </form>
  );
}

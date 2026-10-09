"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { Check, Heart, Sparkle, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";

const rsvpFormSchema = zod.object({
  guestName: zod.string().min(2, "Name must be at least 2 characters"),
  message: zod.string().optional(),
});

type RSVPFormValues = zod.infer<typeof rsvpFormSchema>;

interface EventDetails {
  name: string;
  enabled: boolean;
  venue?: string;
  date?: string;
  time?: string;
}

interface GuestMessageFormProps {
  invitationId: string;
  events: EventDetails[];
  onSuccessSubmit?: () => void;
}

export function GuestMessageForm({ invitationId, events, onSuccessSubmit }: GuestMessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Track RSVP attendance per event: { [eventName]: boolean }
  const [eventAttendance, setEventAttendance] = useState<Record<string, { attending: boolean; guests: number }>>(() => {
    const initial: Record<string, { attending: boolean; guests: number }> = {};
    events.forEach(event => {
      if (event.enabled) {
        initial[event.name] = { attending: true, guests: 1 };
      }
    });
    return initial;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      guestName: "",
      message: "",
    }
  });

  const handleToggleAttendance = (eventName: string, attending: boolean) => {
    setEventAttendance(prev => ({
      ...prev,
      [eventName]: {
        ...prev[eventName],
        attending
      }
    }));
  };

  const handleGuestsChange = (eventName: string, count: number) => {
    setEventAttendance(prev => ({
      ...prev,
      [eventName]: {
        ...prev[eventName],
        guests: Math.max(1, count)
      }
    }));
  };

  const onSubmit = async (data: RSVPFormValues) => {
    setIsSubmitting(true);


    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationId,
          guestName: data.guestName,
          message: data.message || "",
          rsvpJson: eventAttendance,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
        if (onSuccessSubmit) onSuccessSubmit();
      } else {
        console.error("Failed to submit RSVP");
      }
    } catch (err) {
      console.error("Error submitting RSVP form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeEvents = events.filter(e => e.enabled);

  if (isSubmitted) {
    return (
      <DoubleBezelCard className="w-full max-w-lg mx-auto text-center py-10 flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 mb-6">
          <Check className="h-8 w-8" weight="bold" />
        </div>
        
        <h3 className="font-serif text-2xl text-stone-800 dark:text-stone-100 font-bold mb-2">
          Thank you for your response!
        </h3>
        
        <p className="text-sm text-stone-500 max-w-[40ch] mb-6">
          Your RSVP details and wedding wishes have been saved.
        </p>

        {/* Viral RSVP Referral Loop */}
        <div className="w-full border-t border-dashed border-stone-200 dark:border-stone-800 pt-6 mt-2 flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-600 mb-2">
            <Sparkle className="h-4 w-4 animate-spin-slow" weight="fill" />
            <span className="text-[10px] uppercase font-bold tracking-[0.15em]">Made with WedInvites</span>
          </div>
          
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-4 max-w-[30ch]">
            Loved this digital wedding invitation? Create yours in just 5 minutes.
          </p>
          
          <Link href="/templates">
            <PremiumButton>Create Your Invitation</PremiumButton>
          </Link>
        </div>
      </DoubleBezelCard>
    );
  }

  return (
    <DoubleBezelCard className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl font-bold text-stone-800 dark:text-stone-100">
          Will You Attend?
        </h3>
        <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider">
          Please confirm your attendance & leave your wishes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Name field */}
        <div className="space-y-1.5">
          <label htmlFor="guestName" className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
            Your Name
          </label>
          <input
            id="guestName"
            type="text"
            placeholder="Enter your full name"
            {...register("guestName")}
            className={`w-full px-4 py-3 rounded-xl border bg-transparent text-sm focus:outline-none transition-all ${
              errors.guestName
                ? "border-red-500 focus:border-red-500"
                : "border-stone-200 dark:border-stone-800 focus:border-[#082F27] dark:focus:border-amber-400"
            }`}
          />
          {errors.guestName && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.guestName.message}</p>
          )}
        </div>

        {/* Multi-Event RSVP Toggles */}
        {activeEvents.length > 0 && (
          <div className="space-y-3">
            <span className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
              Select Events to Attend
            </span>
            
            <div className="space-y-3">
              {activeEvents.map((event) => {
                const attendance = eventAttendance[event.name] || { attending: true, guests: 1 };
                
                return (
                  <div
                    key={event.name}
                    className={`p-4 rounded-xl border transition-all ${
                      attendance.attending
                        ? "border-[#082F27]/30 bg-[#082F27]/[0.02] dark:border-amber-500/20 dark:bg-amber-500/[0.01]"
                        : "border-stone-100 dark:border-stone-800 bg-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                          {event.name}
                        </h4>
                        {event.date && (
                          <span className="text-[10px] text-stone-400 font-mono">
                            {event.date}
                          </span>
                        )}
                      </div>
                      
                      {/* Attending toggle */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(event.name, true)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            attendance.attending
                              ? "bg-[#082F27] text-white dark:bg-amber-500 dark:text-black"
                              : "bg-stone-100 text-stone-500 dark:bg-stone-800"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(event.name, false)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            !attendance.attending
                              ? "bg-[#082F27] text-white dark:bg-amber-500 dark:text-black"
                              : "bg-stone-100 text-stone-500 dark:bg-stone-800"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Guests count input if attending */}
                    {attendance.attending && (
                      <div className="mt-3 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <label className="text-xs text-stone-500">Number of Guests:</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleGuestsChange(event.name, attendance.guests - 1)}
                            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-sm font-bold flex items-center justify-center hover:bg-stone-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{attendance.guests}</span>
                          <button
                            type="button"
                            onClick={() => handleGuestsChange(event.name, attendance.guests + 1)}
                            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-sm font-bold flex items-center justify-center hover:bg-stone-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message field */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
            Wedding Wishes
          </label>
          <textarea
            id="message"
            placeholder="Write a sweet message for the couple..."
            rows={4}
            {...register("message")}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-transparent text-sm focus:outline-none focus:border-[#082F27] dark:focus:border-amber-400 transition-all resize-none"
          />
        </div>

        {/* Submit button */}
        <PremiumButton
          type="submit"
          className="w-full flex justify-between"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit RSVP & Wishes"}
        </PremiumButton>
      </form>
    </DoubleBezelCard>
  );
}

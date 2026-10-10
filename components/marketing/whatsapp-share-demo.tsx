"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ShareNetwork,
  ArrowLeft,
  VideoCamera,
  Phone,
  DotsThreeVertical,
  Smiley,
  Paperclip,
  Camera,
  Microphone,
  Checks,
} from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";

const INVITE_IMAGE =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop";

type ChatStep =
  | "friend-question"
  | "typing-out"
  | "invite-msg"
  | "preview"
  | "friend-typing"
  | "friend-wow"
  | "brand-msg";

const STEP_MS: Record<ChatStep, number> = {
  "friend-question": 1200,
  "typing-out": 1400,
  "invite-msg": 900,
  preview: 1600,
  "friend-typing": 1200,
  "friend-wow": 1400,
  "brand-msg": 2800,
};

const SEQUENCE: ChatStep[] = [
  "friend-question",
  "typing-out",
  "invite-msg",
  "preview",
  "friend-typing",
  "friend-wow",
  "brand-msg",
];

const WA = {
  header: "#075E54",
  sent: "#d9fdd3",
  chatBg: "#efeae2",
  inputBg: "#f0f2f5",
  read: "#53bdeb",
} as const;

function TypingDots({ align }: { align: "left" | "right" }) {
  return (
    <div
      className={`flex max-w-[78%] rounded-lg px-3 py-2.5 shadow-sm ${
        align === "left" ? "rounded-tl-none bg-white" : "ml-auto rounded-tr-none bg-[#d9fdd3]"
      }`}
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-stone-400"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function BubbleMeta({ time, read }: { time: string; read?: boolean }) {
  return (
    <span className="ml-2 inline-flex shrink-0 items-center gap-0.5 align-bottom text-[9px] leading-none text-stone-500">
      {time}
      {read && <Checks size={12} weight="bold" className="text-[#53bdeb]" aria-hidden />}
    </span>
  );
}

function ChatBubble({
  align,
  children,
  time,
  read,
}: {
  align: "left" | "right";
  children: React.ReactNode;
  time: string;
  read?: boolean;
}) {
  const isSent = align === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className={`max-w-[85%] ${isSent ? "ml-auto" : ""}`}
    >
      <div
        className={`rounded-lg px-2.5 py-1.5 text-[11px] leading-[1.35] shadow-sm ${
          isSent ? "rounded-tr-none bg-[#d9fdd3] text-stone-800" : "rounded-tl-none bg-white text-stone-800"
        }`}
      >
        <span className="whitespace-pre-wrap">{children}</span>
        <BubbleMeta time={time} read={read} />
      </div>
    </motion.div>
  );
}

function InvitePreviewCard({ time }: { time: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#d9fdd3] p-1 shadow-sm"
    >
      <div className="overflow-hidden rounded-md bg-white">
        <div className="aspect-square overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={INVITE_IMAGE} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="px-2.5 py-2">
          <p className="text-[11px] font-semibold leading-tight text-stone-900">
            Priya &amp; Arjun, Wedding
          </p>
          <p className="mt-0.5 text-[10px] text-stone-500">{siteConfig.domain}/priya-arjun</p>
        </div>
      </div>
      <div className="flex justify-end px-1.5 pb-0.5 pt-1">
        <BubbleMeta time={time} read />
      </div>
    </motion.div>
  );
}

function WhatsappHeader() {
  return (
    <div
      className="flex shrink-0 items-center gap-2 px-2 py-2 text-white"
      style={{ backgroundColor: WA.header }}
    >
      <button type="button" className="flex h-8 w-8 items-center justify-center" aria-hidden>
        <ArrowLeft size={20} weight="regular" />
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#128C7E] text-sm font-semibold">
        L
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium leading-tight">Lucía</p>
        <p className="text-[11px] text-white/75">online</p>
      </div>
      <div className="flex items-center gap-3 pr-1">
        <VideoCamera size={20} weight="regular" aria-hidden />
        <Phone size={18} weight="regular" aria-hidden />
        <DotsThreeVertical size={20} weight="bold" aria-hidden />
      </div>
    </div>
  );
}

function WhatsappInputBar() {
  return (
    <div
      className="flex shrink-0 items-center gap-2 px-2 py-2"
      style={{ backgroundColor: WA.inputBg }}
    >
      <div className="flex min-h-[42px] flex-1 items-center gap-2 rounded-full bg-white px-3 py-2">
        <Smiley size={22} weight="regular" className="shrink-0 text-stone-400" aria-hidden />
        <span className="flex-1 text-[13px] text-stone-400">Type a message</span>
        <Paperclip size={20} weight="regular" className="shrink-0 text-stone-400" aria-hidden />
        <Camera size={20} weight="regular" className="shrink-0 text-stone-400" aria-hidden />
      </div>
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: WA.header }}
        aria-hidden
      >
        <Microphone size={20} weight="fill" />
      </button>
    </div>
  );
}

export function WhatsappShareDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const [stepIndex, setStepIndex] = useState(0);

  const step = SEQUENCE[stepIndex] ?? "brand-msg";
  const stepOrder = (s: ChatStep) => SEQUENCE.indexOf(s);
  const reached = (s: ChatStep) => stepOrder(step) >= stepOrder(s);

  useEffect(() => {
    if (!inView) return;
    const current = SEQUENCE[stepIndex] ?? "brand-msg";
    const timer = window.setTimeout(() => {
      setStepIndex((i) => (i + 1) % SEQUENCE.length);
    }, STEP_MS[current]);
    return () => clearTimeout(timer);
  }, [inView, stepIndex]);

  useEffect(() => {
    if (!inView) setStepIndex(0);
  }, [inView]);

  return (
    <div ref={ref} className="mt-16 md:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        className="mx-auto mb-10 max-w-2xl rounded-2xl border border-black/[0.05] bg-[#F7F5F0] p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
            <ShareNetwork size={20} weight="light" />
          </div>
          <span className="text-xs font-mono text-stone-400">04</span>
        </div>
        <h3 className="mt-4 font-serif text-2xl text-[#1A1A1A] md:text-3xl">Share it in one tap</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Send your invite via WhatsApp, SMS or any app. No paper, no waiting.
        </p>
      </motion.div>

      {/* Phone — fixed 9:19.5 aspect like real device */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
        className="relative mx-auto w-[min(100%,280px)]"
      >
        <div className="relative rounded-[2.35rem] border-[4px] border-[#1a1a1a] bg-[#1a1a1a] p-[3px] shadow-[0_20px_56px_rgba(0,0,0,0.14)]">
          <div className="absolute left-1/2 top-[7px] z-20 h-[20px] w-[30%] -translate-x-1/2 rounded-full bg-[#1a1a1a]" />

          <div className="flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2rem] bg-[#efeae2]">
            <WhatsappHeader />

            <div
              className="flex min-h-0 flex-1 flex-col justify-end space-y-2 overflow-hidden px-2 pb-2 pt-3"
              style={{
                backgroundColor: WA.chatBg,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c20-8 40-8 60 0s40 8 40 8' fill='none' stroke='%23d4cfc7' stroke-width='0.6' opacity='0.45'/%3E%3Cpath d='M0 20c20 8 40 8 60 0s40-8 40-8' fill='none' stroke='%23d4cfc7' stroke-width='0.6' opacity='0.35'/%3E%3Cpath d='M0 60c20-8 40-8 60 0s40 8 40 8' fill='none' stroke='%23d4cfc7' stroke-width='0.6' opacity='0.35'/%3E%3C/svg%3E")`,
              }}
            >
              <div className="flex justify-center pb-1">
                <span className="rounded-md bg-white/90 px-2.5 py-0.5 text-[10px] text-stone-600 shadow-sm">
                  Today
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {reached("friend-question") && (
                  <ChatBubble key="q" align="left" time="10:42">
                    When is your wedding again?
                  </ChatBubble>
                )}

                {step === "typing-out" && (
                  <motion.div key="typing-out" className="flex justify-end">
                    <TypingDots align="right" />
                  </motion.div>
                )}

                {reached("invite-msg") && step !== "typing-out" && (
                  <ChatBubble key="invite" align="right" time="10:42" read>
                    Here&apos;s the invite 💖
                  </ChatBubble>
                )}

                {reached("preview") && step !== "typing-out" && (
                  <InvitePreviewCard key="preview" time="10:43" />
                )}

                {step === "friend-typing" && (
                  <motion.div key="typing-friend">
                    <TypingDots align="left" />
                  </motion.div>
                )}

                {reached("friend-wow") && step !== "friend-typing" && (
                  <ChatBubble key="wow" align="left" time="10:44">
                    Wow 🤩 it&apos;s stunning!
                  </ChatBubble>
                )}

                {reached("brand-msg") && (
                  <ChatBubble key="brand" align="right" time="10:44" read>
                    Made by <span className="font-semibold">{siteConfig.domain}</span> ✨
                  </ChatBubble>
                )}
              </AnimatePresence>
            </div>

            <WhatsappInputBar />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

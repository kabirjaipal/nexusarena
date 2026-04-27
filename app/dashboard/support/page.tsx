"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Mail, MessageSquare, ShieldCheck, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I register for a tournament?",
      answer: "Go to the 'Tournaments' page, select the tournament you're interested in, and click the 'Register' button. You will need to complete your KYC and pay the entry fee to confirm your spot."
    },
    {
      question: "Why is my KYC pending?",
      answer: "Our team reviews KYC documents manually to ensure platform integrity. This usually takes 12-24 hours. You'll receive a notification once your status is updated."
    },
    {
      question: "How do I receive my prize money?",
      answer: "Once a tournament is completed and results are verified, prize money is credited to your wallet. You can then request a payout to your bank account via the 'Payouts' section."
    },
    {
      question: "What happens if a tournament is cancelled?",
      answer: "If a tournament is cancelled for any reason, the entry fee is automatically refunded to your original payment method within 5-7 business days."
    },
    {
      question: "I'm facing technical issues during a match. What should I do?",
      answer: "Please contact our support team immediately via the WhatsApp support link or email us at support@nexusarena.com with your match ID and a screenshot of the issue."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions or get in touch with our team.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-all hover:shadow-md">
          <CardHeader className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Get a response within 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-semibold">support@nexusarena.com</p>
            <Button variant="outline" className="mt-4 w-full">Email Us</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-green-500/50 transition-all hover:shadow-md">
          <CardHeader className="text-center">
            <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>WhatsApp Support</CardTitle>
            <CardDescription>Instant chat during tournament hours</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-semibold">+91 98765 43210</p>
            <Button variant="outline" className="mt-4 w-full border-green-600 text-green-600 hover:bg-green-500/10">Chat Now</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-yellow-500/50 transition-all hover:shadow-md">
          <CardHeader className="text-center">
            <div className="bg-yellow-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Fair Play Policy</CardTitle>
            <CardDescription>Learn about our anti-cheat rules</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">Zero tolerance for hacking or cheating.</p>
            <Button variant="outline" className="mt-4 w-full border-yellow-600 text-yellow-600 hover:bg-yellow-500/10">Read Rules</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <div 
                  className={cn(
                    "px-4 transition-all duration-200 ease-in-out",
                    openIndex === index ? "py-4 max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  )}
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

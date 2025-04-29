"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Github, Mail, Send } from "lucide-react"

// Initialize EmailJS with your user ID
const initializeEmailJS = () => {
  // This function would normally initialize EmailJS
  // For demonstration purposes, we're just logging
  console.log("EmailJS would be initialized here")
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    documentType: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    // Initialize EmailJS when component mounts
    initializeEmailJS()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // In a real implementation, this would use EmailJS or a similar service
      // For demonstration, we'll simulate sending an email

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log what would be sent
      console.log("Email would be sent to: immutable.help@gmail.com")
      console.log("Form data:", formData)

      // In production, you would use EmailJS like this:
      /*
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          to_email: 'immutable.help@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          document_type: formData.documentType,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY'
      )
      */

      // Show success message
      setSubmitStatus({
        success: true,
        message: "Thank you for your message! Your email has been sent to the Immutable team.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        documentType: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        success: false,
        message:
          "There was an error sending your message. Please try again or contact us directly at immutable.help@gmail.com",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Have a document to share or questions about the project? Get in touch with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Share a Document</CardTitle>
              <CardDescription>
                Submit information about historical texts, Bible translations, or martyrs' testimonies you'd like to
                contribute to the archive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Input
                    id="documentType"
                    name="documentType"
                    placeholder="Bible translation, historical text, etc."
                    value={formData.documentType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Describe the document you'd like to contribute..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {submitStatus && (
                  <div
                    className={`p-3 rounded-md ${submitStatus.success ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your message will be delivered to immutable.help@gmail.com
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Connect with Us</CardTitle>
                <CardDescription>Other ways to reach out and contribute to the Immutable project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Github className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-muted-foreground">
                      <a
                        href="https://github.com/THookz/Immutable"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        github.com/THookz/Immutable
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      <a href="mailto:immutable.help@gmail.com" className="hover:text-primary transition-colors">
                        immutable.help@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 backdrop-blur-sm border-primary/20 flex-grow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Why Contribute?</h3>
                <p className="text-muted-foreground mb-4">
                  "And you shall know the truth, and the truth shall make you free."
                  <span className="block mt-1 text-right">— John 8:32</span>
                </p>
                <p className="text-muted-foreground">
                  By contributing to Immutable, you're helping preserve vital historical and spiritual knowledge for
                  future generations, ensuring that truth remains accessible despite censorship or manipulation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

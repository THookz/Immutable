"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GitBranch, Upload, BookOpen, FileText, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ContributeSection() {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [ipfsLink, setIpfsLink] = useState("")
  const [isSubmittingLink, setIsSubmittingLink] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleDirectSubmission = async () => {
    if (!ipfsLink.trim()) {
      alert("Please enter your IPFS link")
      return
    }

    setIsSubmittingLink(true)

    try {
      // In a real implementation, this would send the link to a server or API
      // For demonstration, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("IPFS link submitted:", ipfsLink)

      setSubmitStatus({
        success: true,
        message: "Thank you! Your IPFS link has been submitted successfully.",
      })

      // Reset form
      setIpfsLink("")

      // Close dialog after a delay
      setTimeout(() => {
        setShowSubmissionDialog(false)
        setSubmitStatus(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting link:", error)
      setSubmitStatus({
        success: false,
        message: "There was an error submitting your link. Please try again.",
      })
    } finally {
      setIsSubmittingLink(false)
    }
  }

  return (
    <section id="contribute" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contribute to Immutable</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Help preserve truth for future generations by contributing documents, translations, or technical expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Submit Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-base mb-4">
                Share historical texts, Bible translations, martyrs' testimonies, or prophecy records to be preserved in
                our decentralized archive.
              </CardDescription>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
                <li>Format your document according to our guidelines</li>
                <li>Upload to IPFS using Pinata, Infura, or other IPFS service</li>
                <li>Submit a pull request with the IPFS hash and metadata</li>
              </ol>
              <Button asChild>
                <a
                  href="https://github.com/THookz/Immutable/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Submission Guidelines
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Technical Contributions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-base mb-4">
                Contribute to the development of Immutable's infrastructure, tools, and interfaces to improve
                accessibility and preservation.
              </CardDescription>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Frontend development for better document browsing</li>
                <li>Backend improvements for decentralized storage</li>
                <li>Documentation and educational resources</li>
                <li>Integration with additional decentralized networks</li>
              </ul>
              <Button asChild>
                <a href="https://github.com/THookz/Immutable" target="_blank" rel="noopener noreferrer">
                  GitHub Repository
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <Card className="bg-primary/10 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <p className="text-lg font-medium">Ready to contribute?</p>
              </div>
              <Button onClick={() => setShowSubmissionDialog(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Start a Submission
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-primary">✅</span> Before You Submit Your File
            </DialogTitle>
            <DialogDescription>
              Have you uploaded your file to IPFS using Storacha? To preserve your submission immutably and ensure
              censorship resistance, we require contributors to upload their documents to IPFS first.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p>You can easily do this using the Storacha Console:</p>
            <Button variant="outline" className="w-full" asChild>
              <a href="https://console.storacha.network" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                console.storacha.network
              </a>
            </Button>

            <div className="mt-4">
              <p className="mb-2">Need help? Follow this step-by-step guide:</p>
              <Button variant="link" className="px-0" asChild>
                <a
                  href="https://github.com/THookz/Immutable/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IPFS Upload Guide →
                </a>
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Confirm Before Proceeding:</h4>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="ipfs-confirmation"
                  checked={isConfirmed}
                  onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
                />
                <Label htmlFor="ipfs-confirmation" className="text-sm">
                  I have uploaded my file to IPFS and have the link ready to submit
                </Label>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ipfs-link">Your IPFS Link:</Label>
                  <Input
                    id="ipfs-link"
                    placeholder="https://ipfs.io/ipfs/..."
                    value={ipfsLink}
                    onChange={(e) => setIpfsLink(e.target.value)}
                    disabled={!isConfirmed}
                  />
                </div>

                {submitStatus && (
                  <div
                    className={`p-3 rounded-md ${
                      submitStatus.success
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            <p>
              Use Discord? Check out{" "}
              <a
                href="https://github.com/THookz/Immutable/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                our contributors page
              </a>
            </p>
          </div>

          <DialogFooter className="flex flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>
              Cancel
            </Button>
            <Button disabled={!isConfirmed || !ipfsLink.trim() || isSubmittingLink} onClick={handleDirectSubmission}>
              {isSubmittingLink ? "Submitting..." : "Submit Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

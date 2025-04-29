import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Lock, Network, FileText, Globe, ExternalLink } from "lucide-react"

export function TechnologiesSection() {
  return (
    <section id="technologies" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Immutable leverages cutting-edge decentralized technologies to ensure content remains censorship-resistant
            and accessible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <TechCard
            title="IPFS (InterPlanetary File System)"
            description="A peer-to-peer hypermedia protocol designed to preserve and grow humanity's knowledge by making the web upgradeable, resilient, and more open."
            icon={Globe}
            link="https://ipfs.tech/"
          />

          <TechCard
            title="IBC (Inter-Blockchain Communication)"
            description="A protocol that enables communication between different blockchain networks, allowing for the transfer of data and assets across independent distributed ledgers."
            icon={Network}
            link="https://ibcprotocol.dev/"
          />

          <TechCard
            title="Jackal Protocol"
            description="A decentralized storage network built on Cosmos SDK, providing secure file storage with privacy features and content addressing."
            icon={Database}
            link="https://www.jackalprotocol.com/"
          />

          <TechCard
            title="Sentinel DVPN"
            description="A decentralized Virtual Private Network (dVPN) providing secure, private, and censorship-resistant internet access."
            icon={Lock}
            link="https://www.sentinel.co/"
          />

          <TechCard
            title="Secret Network"
            description="A blockchain with privacy-preserving smart contracts, enabling secure computation while keeping data private."
            icon={FileText}
            link="https://docs.scrt.network/secret-network-documentation"
          />
        </div>
      </div>
    </section>
  )
}

function TechCard({
  title,
  description,
  icon: Icon,
  link,
}: {
  title: string
  description: string
  icon: React.ElementType
  link: string
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-muted-foreground text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Learn More
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

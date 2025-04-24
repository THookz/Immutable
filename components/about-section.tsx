import { Card, CardContent } from "@/components/ui/card"
import { Flame, Shield, BookOpen } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About the Project</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Immutable is a censorship-resistant archive safeguarding martyrs' testimonies, prophecy fulfillment, and
            historical records using decentralized technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Flame className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Preserving Truth</h3>
              <p className="text-center text-muted-foreground">
                Safeguarding historical records, suppressed books, and linguistic accuracy from censorship and
                manipulation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Decentralized Protection</h3>
              <p className="text-center text-muted-foreground">
                Using IBC, IPFS, Jackal, Sentinel DVPN, and Secret Network to ensure content remains immutable for
                generations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Accessible Knowledge</h3>
              <p className="text-center text-muted-foreground">
                Making Bible translations, prophecy records, martyrs' testimonies, and lost books freely available to
                all.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Our mission is to protect, restore, and distribute historical truth. In an age where information can be
                manipulated, censored, or lost, Immutable stands as a beacon of preservation using the most advanced
                decentralized technologies.
              </p>
              <p className="text-muted-foreground">
                By leveraging blockchain interoperability, distributed file systems, and privacy-preserving networks, we
                ensure that critical historical documents, religious texts, and suppressed knowledge remain accessible
                for future generations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

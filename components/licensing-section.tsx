import { Card, CardContent } from "@/components/ui/card"
import { FileCode, FileText } from "lucide-react"

export function LicensingSection() {
  return (
    <section id="licensing" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dual Licensing</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Immutable uses a dual licensing approach to protect both content and code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Content License</h3>
              </div>
              <p className="text-muted-foreground mb-4">All content in the Immutable archive is licensed under:</p>
              <div className="bg-background/50 p-4 rounded-lg border border-border mb-4">
                <p className="font-medium">
                  Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You are free to share and adapt the material</li>
                <li>You must give appropriate credit</li>
                <li>You may not use the material for commercial purposes</li>
                <li>
                  If you remix, transform, or build upon the material, you must distribute your contributions under the
                  same license
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileCode className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Code License</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                All blockchain tools and software components are licensed under:
              </p>
              <div className="bg-background/50 p-4 rounded-lg border border-border mb-4">
                <p className="font-medium">GNU General Public License v3.0 (GPLv3)</p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Freedom to use the software for any purpose</li>
                <li>Freedom to change the software to suit your needs</li>
                <li>Freedom to share the software with your friends and neighbors</li>
                <li>Freedom to share the changes you make</li>
                <li>Any derivative work must also be distributed under GPLv3</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

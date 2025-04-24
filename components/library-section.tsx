"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real implementation, this would be fetched from the repository
const documents = [
  // Historical documents - Using real links from the repository
  {
    id: 1,
    title: "0-100 AD – Early Church History",
    description:
      "Documents covering the apostolic era and early Christian church development during the first century.",
    category: "historical",
    ipfsLink:
      "https://bafybeiekpl6nqwo5kz5k4qmgwo5f3e4ilrd3vkmecjx6ajjmaddr2ues6q.ipfs.w3s.link/History-Of-The-Christian-Church-01.pdf",
    tags: ["early-church", "apostolic", "first-century"],
  },
  {
    id: 2,
    title: "100-325 AD – Christianity under Persecution & Early Councils",
    description: "Records of Christian persecution under the Roman Empire and the formation of early church councils.",
    category: "historical",
    ipfsLink:
      "https://bafybeien7jecrd3kenxxbvkjmm4op3vcpef3arspb7rtigzy7es72thzea.ipfs.w3s.link/History-Of-The-Christian-Church-02.pdf",
    tags: ["persecution", "councils", "roman-empire"],
  },
  {
    id: 3,
    title: "311-600 AD – Constantine, Church-State Alliance",
    description:
      "Documents covering the Constantinian shift and the establishment of Christianity as a state religion.",
    category: "historical",
    ipfsLink:
      "https://bafybeifybhwroffbk4zemaodqow63ovgg4wpcx26kqjldnkrgwnxzqvgfe.ipfs.w3s.link/History-Of-The-Christian-Church-03.pdf",
    tags: ["constantine", "church-state", "byzantine"],
  },
  {
    id: 4,
    title: "590-1073 AD – Medieval Christianity",
    description: "Records from the early medieval period including the rise of monasticism and the Great Schism.",
    category: "historical",
    ipfsLink:
      "https://bafybeibsmpi5tsv6x5qpvqlc7kxltnggnhocn473fpnfdok3xkwziy4h2q.ipfs.w3s.link/History-Of-The-Christian-Church-04.pdf",
    tags: ["medieval", "monasticism", "schism"],
  },
  {
    id: 5,
    title: "1049-1294 AD – The Middle Ages, Crusades, Papal Power",
    description: "Documents covering the height of papal power, the crusades, and medieval theological developments.",
    category: "historical",
    ipfsLink:
      "https://bafybeiayp3mee6y523jix5xjvmqd75kyiuraz2mptyy7ayseay754gwkd4.ipfs.w3s.link/History-Of-The-Christian-Church-05.pdf",
    tags: ["crusades", "papal", "middle-ages"],
  },
  {
    id: 6,
    title: "1294-1517 AD – Late Middle Ages & Early Dissenters",
    description: "Records of pre-Reformation movements and early dissenters like Wycliffe and Hus.",
    category: "historical",
    ipfsLink:
      "https://bafybeigstzwkc3ben7bumggrj2orq6jjb4gnaqfwxfcxjo7t3ojqu6kpuy.ipfs.w3s.link/History-Of-The-Christian-Church-06.pdf",
    tags: ["wycliffe", "hus", "pre-reformation"],
  },
  {
    id: 7,
    title: "Modern Christianity – The German Reformation",
    description: "Documents covering Martin Luther and the German Reformation movement.",
    category: "historical",
    ipfsLink:
      "https://bafybeiccepga3pk3vyhwtq2ws7qccjgihmhcpc4xlxq56w27gxeuuuu2jy.ipfs.w3s.link/History-Of-The-Christian-Church-07.pdf",
    tags: ["luther", "reformation", "germany"],
  },
  {
    id: 8,
    title: "Modern Christianity – The Swiss Reformation",
    description: "Records of Zwingli, Calvin, and the Swiss Reformation movement.",
    category: "historical",
    ipfsLink:
      "https://bafybeicxrgd7gnv2pbcbhmn4cuonewahlbbsbgrsnriswhssidyj4k6xii.ipfs.w3s.link/History-Of-The-Christian-Church-08.pdf",
    tags: ["calvin", "zwingli", "switzerland"],
  },
  {
    id: 9,
    title: "History of the Reformation of the Sixteenth Century",
    description: "J. H. Merle D'Aubigné's comprehensive account of the Protestant Reformation.",
    category: "historical",
    ipfsLink:
      "https://bafybeigfcon7n4hgcem2e72uuzshesq2lroqz22fqnzhcg5yapxxs7moge.ipfs.w3s.link/History-Of-The-Reformation.pdf",
    tags: ["reformation", "sixteenth-century", "protestant"],
  },
  // Bible Translations
  {
    id: 10,
    title: "The Holy Bible - 1611 King James Version",
    description:
      "The Authorized King James Version of the Holy Bible, first published in 1611, one of the most influential and widely read Bible translations in English.",
    category: "translations",
    ipfsLink:
      "https://bafybeigjaa6mkofcjbr3bk6x5a5qx7c42pbig4ahmqoxp6hz7upqupgzg4.ipfs.w3s.link/The%20Holy%20Bible%20from%201611%20(KJV).pdf",
    tags: ["king-james", "english", "authorized-version"],
  },
  {
    id: 11,
    title: "The Geneva Bible",
    description:
      "A translation of the Bible published between 1557 and 1560, notable for being the primary Bible of the Protestant Reformation and used by Shakespeare, Bunyan, and the Puritans.",
    category: "translations",
    ipfsLink: "https://bafybeif3vahxl7qepgxwiuym4yx4fgn3nwimfqhpb5jaqsts4ydtfp4lny.ipfs.w3s.link/GenevaBible.pdf",
    tags: ["geneva", "reformation", "puritan"],
  },
  {
    id: 12,
    title: "The Bible and Bible Translations: Summary of Changes",
    description:
      "A comprehensive overview of Bible translations throughout history and the key differences between various versions.",
    category: "translations",
    ipfsLink:
      "https://bafybeibpm4rsxhlag73o7gpkmbbhwwjdgnrklli3lqajj4hwoekaz365im.ipfs.w3s.link/The-Bible-and-Bible-Translations.pdf",
    tags: ["comparison", "history", "translations"],
  },
  // Suppressed Books
  {
    id: 13,
    title: "The Vatican Moscow Washington Alliance",
    description:
      "By Avro Manhattan. An investigation into the political relationships between the Vatican, Moscow, and Washington during the Cold War era.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeievqghvnqsdfu4aqmzxkt7a6soacrk7bke2zgckkoxwtzs3ghovxm.ipfs.w3s.link/the-vatican-moscow-washington-alliance-avro-manhattan.pdf",
    tags: ["vatican", "geopolitics", "cold-war"],
  },
  {
    id: 14,
    title: "IBM and the Holocaust",
    description:
      "Details how IBM's technology and business practices facilitated Nazi Germany's identification and tracking of Jews during the Holocaust.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeibfnhwgvuuz3gcvkkj2uqz7khrgi63h3uh55c3jbvcaxfra3epddy.ipfs.w3s.link/IBM%20and%20The%20Holocaust.pdf",
    tags: ["holocaust", "technology", "corporate-complicity"],
  },
  {
    id: 15,
    title: "Pawns in The Game",
    description:
      "By William Guy Carr. A controversial examination of international politics, banking, and secret societies throughout history.",
    category: "suppressed-books",
    ipfsLink: "https://bafybeidnymswczunn5ukb2keoznwg4wu3a37gweki7k4ngg7gvxel73gpq.ipfs.w3s.link/pawnsinthegame.pdf",
    tags: ["conspiracy", "banking", "world-order"],
  },
  {
    id: 16,
    title: "Be Wise as Serpents",
    description:
      "By Fritz Springmeier. An investigation into the influence of secret societies and powerful families on world events and religious institutions.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeih3k2ophkmquswy25uiilpyr5shmovfckbtuwtpbb2tthnwkidz6e.ipfs.w3s.link/Be%20Wise%20as%20Serpents.pdf",
    tags: ["secret-societies", "religious-history", "power-structures"],
  },
  // Prophecy
  {
    id: 17,
    title: "The Gospel in Creation",
    description:
      "By E. J. Waggoner. An exploration of how the gospel message is reflected in the natural world and creation itself.",
    category: "prophecy",
    ipfsLink:
      "https://bafybeigjx3bbbuslsqrjg7pxelbprcsozh6vtyuaztwnti4oscqcmqh6hq.ipfs.w3s.link/The-Gospel-In-Creation.pdf",
    tags: ["gospel", "creation", "nature", "theology"],
  },
  // New Books to Add
  {
    id: 18,
    title: "Night Journey From Rome",
    description:
      "A powerful and deeply personal account of Clark Butterfield's transformation from a Roman Catholic priest to a born-again Christian. Written shortly before his death, this book courageously explores the theological contradictions he discovered within Catholicism, his growing disillusionment with institutional religion, and his ultimate spiritual rebirth in Christ.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeie3stm2b4evncz5f46igv3atim6jcwufju7guoe4fofup5xvbmpim.ipfs.w3s.link/Night%20journey%20from%20Rome.pdf",
    tags: ["catholicism", "conversion", "testimony", "spiritual-journey"],
  },
  {
    id: 19,
    title: "Secret Societies and Psychological Warfare",
    description:
      "Historian Michael A. Hoffman II presents a chilling exposé on the invisible influence of occult systems and esoteric rituals embedded within modern political, religious, and cultural institutions. This prophetic work dissects how mass manipulation, trauma-based symbolism, and ritualized deception have been used to shape public consciousness and suppress spiritual awakening.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeiaftqvfd5gux3my6hofs6p754lsodicvr6u3l262vte2uiooduxoa.ipfs.w3s.link/secret-societies-and-psychological-warfare.pdf",
    tags: ["occult-symbolism", "psychological-manipulation", "secret-societies", "mind-control"],
  },
  {
    id: 20,
    title: "The Black Pope: A History of the Jesuits",
    description:
      'This powerful exposé, written by a former Catholic nun, M.F. Cusack, lifts the veil on the secretive history and far-reaching influence of the Jesuit Order—often referred to as "the Church\'s most dangerous agents." This rare firsthand account details the strategies, political intrigues, and religious subversions used by the Jesuits to manipulate global affairs.',
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeiczyiggdkihinibzaxrc46gr452x6kuwqfs4az7slhnj2gvakfumy.ipfs.w3s.link/The%20Black%20Pope%20-%20A%20History%20of%20the%20Jesuits%20(Mary%20Francis%20Cusack).pdf",
    tags: ["jesuits", "catholic-church", "religious-history", "geopolitics"],
  },
  {
    id: 21,
    title: "The Doctrine of the Fourth Commandement",
    description:
      "Preserved as a single surviving copy in the Oxford Library, this rare 1650 treatise by James Ockford is a bold defense of the seventh-day Sabbath. Written during a time of great theological turbulence, Ockford challenges the growing institutional shift from Saturday to Sunday observance, arguing from Scripture, logic, and conscience that the seventh day—not the first—is the true Christian Sabbath.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeie2mwlhlot7dp7vd6incimsrciikwd646renxrzp2wgz26wxdsowa.ipfs.w3s.link/%5BTCP%5D%20The%20doctrine%20of%20the%20Fourth%20Commandement%2C%20deformed%20by%20popery%2C%20reformed%20%26%20re.pdf",
    tags: ["sabbath", "reformation", "biblical-law", "church-history"],
  },
  {
    id: 22,
    title: "50 Years in The Church of Rome",
    description:
      "Charles Chiniquy, a Catholic priest for five decades, offers this courageous and controversial testimony from inside the heart of Roman Catholicism. Exposing manipulation, political entanglements, and deep spiritual conflict, Chiniquy reveals how his conscience and study of the Scriptures ultimately led him to break away—at great personal cost.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeiewunrksen6hxpime5badiwdxk2jbr2gaixmhnmundpl67sspmhy4.ipfs.w3s.link/50%20years%20in%20the%20church%20at%20Rome.pdf",
    tags: ["catholicism", "testimony", "religious-freedom", "reformation"],
  },
  {
    id: 23,
    title: "The Illuminati Formula Used To Create An Undetectable Total Mind Controlled Slave",
    description:
      "This detailed manual, based on survivor testimony, declassified CIA files, and research from inside intelligence and occult networks, lays out the disturbing blueprint for how trauma-based mind control has been used to fracture identity, suppress memory, and create programmable individuals. The authors connect government-sponsored programs like MK-Ultra with occult ritual abuse, showing how elite power structures engineered mind control systems.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeicjglhq2czc7ocvqj5vxp3j7py25m2m6ce36ai2zagmu2wraiszxu.ipfs.w3s.link/Undetected%20Mind%20Controlled%20Slave.pdf",
    tags: ["mind-control", "mk-ultra", "trauma-programming", "intelligence-agencies"],
  },
  {
    id: 24,
    title: "The Deadly Deception",
    description:
      "The gripping personal testimony of Jim Shaw, a former 33rd-degree Freemason and active participant in elite Masonic ceremonies, who came to believe that the core teachings of Freemasonry directly contradict the Gospel of Jesus Christ. With rare access to inner rituals and oaths, Shaw exposes the theological compromises and Babylonian esotericism embedded in high-level Masonic rites.",
    category: "suppressed-books",
    ipfsLink:
      "https://bafybeia4x3lm56n4qranmmktska34uhqceunlu7f5id6sda5o4aa3wbntu.ipfs.w3s.link/The-Deadly-Deception%20(freemasonry).pdf",
    tags: ["freemasonry", "secret-societies", "occult-symbolism", "testimony"],
  },
  // New Prophecy Documents
  {
    id: 25,
    title: "Who Reformers Deemed the Antichrist – With American Quotes on the Jesuits",
    description:
      "This compelling collection of quotes traces the bold and unfiltered views of the Protestant reformers—Martin Luther, William Tyndale, John Wesley, and others—who identified the Antichrist not as a future figure, but as a present spiritual power in their time. It also includes rarely cited warnings from American thinkers and politicians about the historical and covert influence of the Jesuits.",
    category: "prophecy",
    ipfsLink:
      "https://bafybeigwl36lgmar7srveufouhvjibyvuevu44slxiocsizmkj32t253v4.ipfs.w3s.link/Reformers%20view%20on%20antichrist%20and%20quotes%20on%20the%20Jesuits.pdf",
    tags: ["antichrist", "reformation", "prophecy-interpretation", "jesuits", "american-history"],
  },
  {
    id: 26,
    title: "Prophetic History Chart",
    description:
      "A beautifully illustrated, color-coded timeline of prophetic events from the books of Daniel and Revelation. This chart outlines key moments in Bible prophecy, from ancient empires to the Reformation, and traces their fulfillment through historical events. Designed for visual learners and students of biblical prophecy, it includes parallel interpretations from Protestant reformers and classic historicist perspectives.",
    category: "prophecy",
    ipfsLink:
      "https://bafybeiggtgzd6jhkvdqmyfyv43xtru7n4z4qc2lnpgkb7iysrfxq3whuju.ipfs.w3s.link/Prophetic-History-Chart-color.pdf",
    tags: ["daniel", "revelation", "prophecy-timeline", "historicism", "bible-study"],
  },
]

export function LibrarySection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return doc.category === activeTab && matchesSearch
  })

  const copyToClipboard = (text: string) => {
    // Check if navigator.clipboard is available (it's not in all browsers or contexts)
    if (!navigator.clipboard) {
      // Fallback method
      try {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed" // Avoid scrolling to bottom
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (successful) {
          alert("IPFS link copied to clipboard!")
        } else {
          console.error("Fallback: Unable to copy")
          alert("Failed to copy. Please copy the link manually.")
        }
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err)
        alert("Failed to copy. Please copy the link manually.")
      }
      return
    }

    // Use the Clipboard API if available
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("IPFS link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        alert("Failed to copy. Please copy the link manually.")
      })
  }

  return (
    <section id="library" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Document Library</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">
            Explore our growing collection of preserved documents, including historical texts, Bible translations, and
            suppressed books that have been censored or hidden from public view.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="historical">Historical</TabsTrigger>
                <TabsTrigger value="translations">Translations</TabsTrigger>
                <TabsTrigger value="suppressed-books">Books</TabsTrigger>
                <TabsTrigger value="prophecy">Prophecy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-card/50 backdrop-blur-sm border-primary/20 flex flex-col">
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-primary/5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      copyToClipboard(doc.ipfsLink)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy IPFS Link
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={doc.ipfsLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No documents found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

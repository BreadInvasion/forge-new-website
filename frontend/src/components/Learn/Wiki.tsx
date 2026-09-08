import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Trigger
> & {
  children: React.ReactNode;
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger
        className={classNames("AccordionTrigger", className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  );
};

type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof Accordion.Content
> & {
  children: React.ReactNode;
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Accordion.Content
      className={classNames("AccordionContent", className)}
      {...props}
    >
      <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
  );
};

interface AccordionSectionProps {
  title: string;
  defaultValue: string;
  items: Array<{
    value: string;
    title: string;
    content: string;
  }>;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  defaultValue,
  items,
}) => (
  <div className="accordion-section">
    <h2>{title}</h2>
    <Accordion.Root
      className="AccordionRoot"
      type="single"
      defaultValue={defaultValue}
      collapsible
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.value}
          className="AccordionItem"
          value={item.value}
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  </div>
);

const AccordionDemo: React.FC = () => {
  const sections: AccordionSectionProps[] = [
    {
      title: "General Questions",
      defaultValue: "section-1",
      items: [
        {
          value: "item-1",
          title: "When is The Forge open?",
          content:
            "Exact hours depend on volunteer availability. Check the calendar that is on the website.",
        },
        {
          value: "item-2",
          title: "How do I print something at the Forge?",
          content:
            "Come to the Forge during open hours and let a volunteer with a nametag know that you would like to print something. Please have a device with a functional USB port or a USBC port or a USB with the files that you would like to print. ",
        },
        {
          value: "item-3",
          title: "Where is The Forge located?",
          content:
            "The Forge is located in the second floor of Low building. To reach The Forge, take the Low elevator down to floor 2 and follow the signs to The Forge.",
        },
        {
          value: "item-4",
          title:
            "I'm looking to use [insert machine] and have [insert file type]. Is this okay?",
          content:
            "Refer to the machine-specific FAQs further down in this message.",
        },
        {
          value: "item-5",
          title: "Does printing cost money?",
          content:
            "Yes. You will be charged a $20 membership fee to your bursar every semester that you use Forge machines, and you will be charged an additional material cost if you do not use your own material.",
        },
        {
          value: "item-6",
          title: "How much do materials cost?",
          content:
            "To see specific machine costs, refer to the machine-specific FAQs below. Prices may be subject to change. Prices are accurate as of September 2026.",
        },
        {
          value: "item-7",
          title: "How will the Forge charge me?",
          content:
            "The Forge will charge you $20 when you create a Forge account at https://www.rpiforge.dev/ . All money that the Forge charges you will be charged to your bursar, which is the same place that RPI charges you tuition. Charges will appear at the end of the semester. To see specific machine costs, refer to the machine-specific FAQs below.",
        },
        {
          value: "item-8",
          title: "Does the Forge have a lost and found?",
          content:
            "Yes. When you enter, look to your right and there will be a clear plastic box on the floor. All lost items go there.",
        },
      ],
    },
    {
      title: "Sticker Printer",
      defaultValue: "section-2",
      items: [
        {
          value: "item-1",
          title: "What file format do I need to print stickers?",
          content:
            "The printer software accepts mainly JPEG, TIFF and PDF. You may come in with other files such as SVG or PNG, but they will eventually have to be converted to the three supported formats we use.",
        },
        {
          value: "item-2",
          title: "How much does using the sticker printer cost?",
          content:
            "On top of the $20 memberhsip fee, vinyl costs $0.20 cents per inch of vinyl length and $0.02 per gram of ink used. This comes out to less than $2 per foot of stickers, though prices will vary based on the size and amount of stickers.",
        },
        {
          value: "item-3",
          title: "What's a cut contour?",
          content:
            "A cut contour is a cutting path that closely follows the shape of a sticker design. These may also be called die-cut stickers. Volunteers qualified for the sticker printer can make this for you. Our workflow works best for images with a white or transparent background. If your image does not meet this requirement, or if you need a different sticker shape, you must prepare your own PDF.",
        },
        {
          value: "item-4",
          title:
            "I'm making stickers for a club, is there a process for printing more than the limit?",
          content:
            "Yes, please contact an eboard member for further details. Please note that we are not a replacement for a professional print service and we cannot handle very large or last minute requests.",
        },
        {
          value: "item-5",
          title: "How is the sticker shape defined?",
          content:
            "The sticker shape and size is defined with vector shapes in a PDF. If you are familiar with vector design software, it is possible for you to prepare this PDF in advance. Alternatively, all volunteers qualified on the sticker printer are trained to prepare a PDF with a cut contour based on any images you provide. A PDF is not required for rectangular stickers.",
        },
        {
          value: "item-6",
          title: "How can I prepare my own PDF?",
          content:
            "You can use any design software with a PDF export that supports drawing vector shapes. If you are not familiar with these programs and want to get started, please follow these slides closely to learn how to use a free design software called Inkscape. https://docs.google.com/presentation/d/135KbxhJpLeeUxzhNTGTB4zjrX2a9xBU5ZS-fQTTffxA/edit?usp=sharing The link before is part of a collection of resources that help you use different softwares to prepare PDFs. To see other resources, see the “Learning Resources” section in this Google Sheet. https://docs.google.com/spreadsheets/d/1UPmWOT6uAADUIPGQiUxRmzvtwF0X82es7Ph41WIqfy4/edit?usp=sharing Note that some programs may include junk data or postprocessing that may render a PDF unusable. The vector shape that is the cutline must also be in front/on top of everything. DM your PDF to Mikiel Gica and he can check.",
        },
        {
          value: "item-7",
          title: "How many stickers can I print?",
          content:
            "Stickers are printed on a continuous 20in or 18in wide roll of vinyl. You may only print a total of 36in of vinyl length per visit. On a 20in wide roll, this corresponds to roughly 480 2in by 2in stickers. If there are more people waiting to use the machine, we may refuse your request or ask you to print less.",
        },
        {
          value: "item-8",
          title: "How durable are the stickers?",
          content:
            "All stickers will be fully waterproof. However, unlaminated stickers will fade out from solar UV exposure when outdoors.",
        },
        {
          value: "item-9",
          title: "How do I get my stickers laminated?",
          content:
            "We have a cold laminator and clear UV-blocking vinyl, however, laminating stickers properly is a skill that is not part of our standard training. Please ask if you need someone to laminate your stickers and we can connect you with someone who can help. Note that our laminator is NOT for laminating office documents.",
        },
      ],
    },
    {
      title: "3D Printers",
      defaultValue: "section-3",
      items: [
        {
          value: "item-1",
          title: "What kind of filament am I allowed to use?",
          content:
            "PLA, PETG, PLA+, and TPU are allowed. See below for banned brands.",
        },
        {
          value: "item-2",
          title: "What brands of filament are banned?",
          content:
            "The banned brands are Sunlu, Elegoo, Ender, GeeeTech, XYZPrinting and Amazon Basics. Filament with additives (carbon fiber, metal, PLA variants like PLA Pro) or special finishes (wood, marble silk, ect.) are not allowed. This is accurate as of September 2026.",
        },
        {
          value: "item-3",
          title: "I don't have filament. Can I use the Forge's?",
          content:
            "Yes. The Forge stocks PLA, TPU, and PETG in black and white.",
        },
        {
          value: "item-4",
          title: "How much does filament cost?",
          content: "PLA is $0.06/gram and PETG/TPU is $0.09/gram.",
        },
        {
          value: "item-5",
          title: "What kind of file should I use for printing?",
          content:
            "Bring an STL on a USB-accessible computer, or a USB flash drive.",
        },
        {
          value: "item-6",
          title:
            "I use [filament type or brand] all the time and it’s fine, why is it banned?",
          content:
            "Filament quality can be wildly inconsistent and we encounter significantly more spools from a brand or type than an average person. The Forge can get very busy printing time sensitive projects, so failures caused by a bad spool of filament are unacceptable. If you believe your filament type is truly essential for your project, we still want to help. Please ask a room manager to see if we can accommodate you.",
        },
        {
          value: "item-7",
          title: "Do you have multicolor printing?",
          content:
            "Yes! We have a 5 toolhead Prusa XL that can print up to 5 colors.",
        },
        {
          value: "item-8",
          title: "What are the build sizes of the printers?",
          content:
            "A Prusa Mini is 7x7x7 inches, an i3 or i4 is 9x8x8, and an XL is 14x14x14 inches.",
        },
      ],
    },
    {
      title: "Laser Cutter",
      defaultValue: "section-4",
      items: [
        {
          value: "item-1",
          title: "What materials can I use on the laser cutter?",
          content:
            "Most types of wood and paper can be used. Check with a volunteer or room manager before printing. Do NOT cut: PVC, corrugated cardboard, arsenic, asbestos, or people.",
        },
        {
          value: "item-2",
          title: "Can the laser cutter engrave materials?",
          content:
            "Yes! It can engrave laptops, rocks, bread, and most other flat, solid objects.",
        },
        {
          value: "item-3",
          title: "How much does using the laser cutter cost?",
          content: "It's $1 per hour of runtime.",
        },
        {
          value: "item-4",
          title: "Does the Forge stock laser cutting materials?",
          content:
            "No, but we sometimes have free used material in the back room. If some of your material is still usable, we appreciate people leaving it in the back room intead of throwing it away.",
        },
        {
          value: "item-5",
          title: "What size is the laser cutter bed?",
          content: "The bed is 35.4'' W x 23.6'' H.",
        },
      ],
    },
    {
      title: "Resin Printer",
      defaultValue: "section-5",
      items: [
        {
          value: "item-1",
          title: "What kinds of resin does the Forge stock?",
          content:
            "We use only resin provided by Formlabs. We stock Clear and Grey. Please see https://formlabs.com/materials/ for technical details. We do not dye resins for colored prints.",
        },
        {
          value: "item-2",
          title: "How much does using the resin printer cost?",
          content: "$0.8/mL for the grey and clear resin.",
        },
        {
          value: "item-3",
          title: "Do you have [specialty resin?]",
          content: "Currently we do not stock specialty resin.",
        },
        {
          value: "item-3",
          title: "Can I bring in my own resin?",
          content: "Currently you are NOT allowed to bring in your own resin.",
        },
      ],
    },
    {
      title: "Sewing machine",
      defaultValue: "section-6",
      items: [
        {
          value: "item-1",
          title: "What kinds of sewing machines do you have?",
          content:
            "The Forge has a standard Brother sewing machine and an embroidery machine.",
        },
        {
          value: "item-2",
          title: "How do I use the embroidery machine?",
          content:
            "Let people know you are interested in this Discord channel and we will connect you with someone who will help you.",
        },
      ],
    },
    {
      title: "Button Maker",
      defaultValue: "section-7",
      items: [
        {
          value: "item-1",
          title: "You have one of those?",
          content: "Yep.",
        },
        {
          value: "item-2",
          title: "How do I use it?",
          content: "Ask an eboard member.",
        },
      ],
    },
    {
      title: "Drawing Tablet",
      defaultValue: "section-8",
      items: [
        {
          value: "item-1",
          title: "How do I use the drawing tablet?",
          content:
            "It's free to use, if no one else is using it. Ask a volunteer.",
        },
      ],
    },
  ];

  return (
    <div className="wiki">
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>

        {sections.map((section, index) => (
          <AccordionSection
            key={`section-${index}`}
            title={section.title}
            defaultValue={section.defaultValue}
            items={section.items}
          />
        ))}

        <h3>
          If you have any questions, Please visit the Forge and ask the
          volunteers!
        </h3>

        <h1></h1>
        <h1>Training Slides</h1>
        <iframe
          src="https://docs.google.com/presentation/d/1CmwkK1Evvp_0BWViicU-pT_XDuFGact-4_kRH7R0WnE/embed?"
          frameBorder="0"
          width="100%"
          height="600"
          className="w-full max-w-[480px] aspect-video"
        ></iframe>
        <h1></h1>

        <iframe
          src="https://docs.google.com/presentation/d/1kb65644XnRrhrCGokEjaftZFlsJD40XSzA9jwwkEsno/embed?"
          frameBorder="0"
          width="100%"
          height="600"
          className="w-full max-w-[480px] aspect-video"
        ></iframe>
        <h1></h1>

        <iframe
          src="https://docs.google.com/presentation/d/13bkWqiG3Y7H6se2dV5ionpyZpqBgSz8bTrstZuc839Q/embed?"
          frameBorder="0"
          width="100%"
          height="600"
          className="w-full max-w-[480px] aspect-video"
        ></iframe>
        <h1></h1>

        <iframe
          src="https://docs.google.com/presentation/d/14hzSkw8vXyfpSizP4JA-aKf8_6uOOjVam2YJX1eX1fk/embed?"
          frameBorder="0"
          width="100%"
          height="600"
          className="w-full max-w-[480px] aspect-video"
        ></iframe>
        <h1></h1>
      </div>
    </div>
  );
};

export default AccordionDemo;

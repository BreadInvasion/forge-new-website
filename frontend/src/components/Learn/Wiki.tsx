import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof Accordion.Trigger> & {
  children: React.ReactNode;
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className, ...props }) => {
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

type AccordionContentProps = React.ComponentPropsWithoutRef<typeof Accordion.Content> & {
  children: React.ReactNode;
};

const AccordionContent: React.FC<AccordionContentProps> = ({ children, className, ...props }) => {
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

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, defaultValue, items }) => (
  <div className="accordion-section">
    <h2>{title}</h2>
    <Accordion.Root
      className="AccordionRoot"
      type="single"
      defaultValue={defaultValue}
      collapsible
    >
      {items.map((item) => (
        <Accordion.Item key={item.value} className="AccordionItem" value={item.value}>
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
          content: "The Forge is open from 9:00 AM to 6:00 PM on weekdays, 10:00 AM to 5:00 PM on Sunday, and runs volunteer only hours on Saturday."
        },
        {
          value: "item-2",
          title: "How do I print something at the Forge?",
          content: "Come to the Forge during open hours (see above) and let a volunteer know that you would like to print something. They will assist you from there. Please have a device with a functional USB port or a USB with the files that you would like to print."
        },
        {
          value: "item-3",
          title: "Where is The Forge located?",
          content: "The Forge is located in the second floor of Low building. To reach The Forge, take the Low elevator down to floor 2 and follow the signs to The Forge."
        },
        {
          value: "item-4",
          title: "I'm looking to use [insert machine] and have [insert file type]. Is this okay?",
          content: "Refer to the machine-specific FAQs further down in this message."
        },
        {
          value: "item-5",
          title: "Does printing cost money?",
          content: "Yes. You will be charged a $15 membership fee to your bursar every semester that you use Forge machines, and you will be charged an additional material cost if you do not use your own material."
        },
        {
          value: "item-6",
          title: "How will the Forge charge me?",
          content: "The Forge will charge you $15 when you create a Forge account at https://www.rpiforge.dev/ . All money that the Forge charges you will be charged to your bursar, which is the same place that RPI charges you tuition. Charges will appear at the end of the semester. To see specific machine costs, refer to the machine-specific FAQs below."
        },
        {
          value: "item-7",
          title: "Does the Forge have a lost and found?",
          content: "Yes. When you enter, look to your right and there will be a clear plastic box on the floor. All lost items go there."
        }
      ]
    },
    {
      title: "Sticker Printer",
      defaultValue: "section-2",
      items: [
        {
          value: "item-1",
          title: "What file format do I need to print stickers?",
          content: "The sticker printer accepts PNG, JPEG, SVG, and PDF. PDF is the preferred file format, and SVG and JPG is great for cut contours. If you don't have a file in these formats, a volunteer will be happy to help you change it."
        },
        {
          value: "item-2",
          title: "How much does using the sticker printer cost?",
          content: "On top of the $15 membership fee, vinyl costs 1 cent per inch of vinyl length (vertically, not lengthwise) and 1 cent per gram of ink used. This comes out to less than $1 per foot of stickers, though prices may vary based on the amount of ink and vinyl used."
        },
        {
          value: "item-3",
          title: "What's a cut contour?",
          content: "Images with a non geometric shape can be cut around the edges of the shape. We can also cut simple squares and circles, if preferred."
        },
        {
          value: "item-4",
          title: "I'm making stickers for a club, and I need more than 100 stickers. Is this allowed?",
          content: "Please contact an eboard member for further details."
        }
      ]
    },
    {
      title: "3D Printers",
      defaultValue: "section-3",
      items: [
        {
          value: "item-1",
          title: "What kind of filament am I allowed to use?",
          content: "PLA, PETG, ABS, PLA+, and TPU are allowed. See below for allowed brands."
        },
        {
          value: "item-2",
          title: "What brands of filament am I allowed to use?",
          content: "Matterhackers, eSun, Prusament, Polymaker, Hatchbox, and Overture."
        },
        {
          value: "item-3",
          title: "I don't have filament. Can I use the Forge's?",
          content: "Yes. The Forge stocks Matterhackers PLA, TPU, and PETG in black and white."
        },
        {
          value: "item-4",
          title: "How much does filament cost?",
          content: "5 Cents a gram. However, printing is free if you bring your own approved filament."
        },
        {
          value: "item-5",
          title: "What kind of file should I use for printing?",
          content: "Bring an STL on a USB-accessible computer, or a USB flash drive."
        },
        {
          value: "item-6",
          title: "I have [filament type] or [filament brand] that is not on the approved filaments list. Can I still use it?",
          content: "Ask a room manager if this filament is OK to use."
        },
        {
          value: "item-7",
          title: "Do you have multicolor printing?",
          content: "Yes! We have a 5 toolhead Prusa XL that can print up to 5 colors."
        },
        {
          value: "item-8",
          title: "Do you have a resin printer?",
          content: "Yes! We recently acquired a new Formlabs Form 4 resin printer. See below for details."
        }
      ]
    },
    {
      title: "Laser Cutter",
      defaultValue: "section-4",
      items: [
        {
          value: "item-1",
          title: "What materials can I use on the laser cutter?",
          content: "Most types of wood and paper can be used. Check with a volunteer or room manager before printing. Do NOT cut: PVC, corrugated cardboard, arsenic, asbestos, or people."
        },
        {
          value: "item-2",
          title: "Can the laser cutter engrave materials?",
          content: "Yes! It can engrave laptops, rocks, bread, and most other flat, solid objects. Do NOT laser engrave people. It hurts."
        },
        {
          value: "item-3",
          title: "Does the Forge stock laser cutting materials?",
          content: "No, but we sometimes have free used material in the back room. If some of your material is still usable, we appreciate people leaving it in the back room intead of throwing it away."
        },
        {
          value: "item-4",
          title: "What size is the laser cutter bed?",
          content: "The bed is 35.4'' W x 23.6'' H."
        }
      ]
    },
    {
      title: "Resin Printer",
      defaultValue: "section-5",
      items: [
        {
          value: "item-1",
          title: "What kinds of resin does the Forge stock?",
          content: "Clear, Fast, High Temp, Grey, and Rigid 10k."
        },
        {
          value: "item-2",
          title: "Can the laser cutter engrave materials?",
          content: "Yes! It can engrave laptops, rocks, bread, and most other flat, solid objects. Do NOT laser engrave people. It hurts."
        },
        {
          value: "item-3",
          title: "How much does using the resin printer cost?",
          content: "20 cents a mL for generic resin (clear, fast, and grey) and 30 cents a mL for specialty (all other resins)."
        },
        {
          value: "item-4",
          title: "Do you have [specialty resin?]",
          content: "If it's not listed here, ask a room manager for more details."
        }
      ]
    },
    {
      title: "Sewing machine",
      defaultValue: "section-6",
      items: [
        {
          value: "item-1",
          title: "What kinds of sewing machines do you have?",
          content: "The Forge has a standard Brother sewing machine and an embroidery machine."
        },
        {
          value: "item-2",
          title: "How do I use the embroidery machine?",
          content: "Ask Mikiel or Lucas."
        }
      ]
    },
    {
      title: "Button Maker",
      defaultValue: "section-7",
      items: [
        {
          value: "item-1",
          title: "You have one of those?",
          content: "Yep."
        },
        {
          value: "item-2",
          title: "How do I use it?",
          content: "Ask an eboard member."
        }
      ]
    },
    {
      title: "Drawing Tablet",
      defaultValue: "itsectionem-8",
      items: [
        {
          value: "item-1",
          title: "How do I use the drawing tablet?",
          content: "It's free to use, if no one else is using it. Ask a volunteer."
        }
      ]
    }
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
        
        <h3>If you have any questions, Please visit the Forge and ask the volunteers!</h3>

        <h1></h1>
        <h1>Training Slides</h1>
          <iframe src="https://docs.google.com/presentation/d/1CmwkK1Evvp_0BWViicU-pT_XDuFGact-4_kRH7R0WnE/embed?" 
          frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          <h1></h1>

          <iframe src="https://docs.google.com/presentation/d/1kb65644XnRrhrCGokEjaftZFlsJD40XSzA9jwwkEsno/embed?"
          frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          <h1></h1>

          <iframe src="https://docs.google.com/presentation/d/13bkWqiG3Y7H6se2dV5ionpyZpqBgSz8bTrstZuc839Q/embed?" 
          frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          <h1></h1>

          <iframe src="https://docs.google.com/presentation/d/14hzSkw8vXyfpSizP4JA-aKf8_6uOOjVam2YJX1eX1fk/embed?" 
          frameBorder="0" width="100%" height="600" className="w-full max-w-[480px] aspect-video"></iframe>
          <h1></h1>
      </div>
    </div>
  );
};

export default AccordionDemo;
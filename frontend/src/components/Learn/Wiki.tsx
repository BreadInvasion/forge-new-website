import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./styles.css";

type AccordionTriggerProps = React.ComponentPropsWithRef<typeof Accordion.Trigger>;

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

type AccordionContentProps = React.ComponentPropsWithRef<typeof Accordion.Content>;

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

const AccordionDemo: React.FC = () => (
  <div className="wiki" style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ 
      height: "100%", 
      overflowY: "auto", 
      padding: "20px",
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      background: "#eeeeee", 
      boxSizing: "border-box"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "20px", 
        fontSize: "clamp(24px, 5vw, 28px)", 
        position: "static", 
        top: 0, 
        background: "#eeeeee", 
        zIndex: 3,
        width: "100%" 
      }}>
        Frequently Asked Questions
      </h2>
      
      {/* First dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
          General Questions
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-1"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>When is The Forge open?</AccordionTrigger>
            <AccordionContent>
              The Forge is open from 9:00 AM to 6:00 PM on weekdays, 10:00 AM to 5:00 PM on Sunday, and runs volunteer only hours on Saturday.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>How do I print something at the Forge?</AccordionTrigger>
            <AccordionContent>
              Come to the Forge during open hours (see above) and let a volunteer know that you would like to print something. They will assist you from there. Please have a device with a functional USB port or a USB with the files that you would like to print.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>Where is The Forge located?</AccordionTrigger>
            <AccordionContent>
              The Forge is located in the second floor of Low building. To reach The Forge, take the Low elevator down to floor 2 and follow the signs to The Forge.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>I'm looking to use [insert machine] and have [insert file type]. Is this okay?</AccordionTrigger>
            <AccordionContent>
              Refer to the machine-specific FAQs further down in this message.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-5">
            <AccordionTrigger>Does printing cost money?</AccordionTrigger>
            <AccordionContent>
              Yes. You will be charged a $15 membership fee to your bursar every semester that you use Forge machines, and you will be charged an additional material cost if you do not use your own material.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-6">
            <AccordionTrigger>How will the Forge charge me?</AccordionTrigger>
            <AccordionContent>
              The Forge will charge you $15 when you create a Forge account at https://www.rpiforge.dev/ . All money that the Forge charges you will be charged to your bursar, which is the same place that RPI charges you tuition. Charges will appear at the end of the semester. To see specific machine costs, refer to the machine-specific FAQs below.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-7">
            <AccordionTrigger>Does the Forge have a lost and found?</AccordionTrigger>
            <AccordionContent>
              Yes. When you enter, look to your right and there will be a clear plastic box on the floor. All lost items go there.
            </AccordionContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      {/* Second dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
          Sticker Printer
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-2"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>What file format do I need to print stickers?</AccordionTrigger>
            <AccordionContent>
            The sticker printer accepts PNG, JPEG, SVG, and PDF. PDF is the preferred file format, and SVG and JPG is great for cut contours. If you don't have a file in these formats, a volunteer will be happy to help you change it.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>How much does using the sticker printer cost?</AccordionTrigger>
            <AccordionContent>
            On top of the $15 membership fee, vinyl costs 1 cent per inch of vinyl length (vertically, not lengthwise) and 1 cent per gram of ink used. This comes out to less than $1 per foot of stickers, though prices may vary based on the amount of ink and vinyl used.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>What's a cut contour?</AccordionTrigger>
            <AccordionContent>
            Images with a non geometric shape can be cut around the edges of the shape. We can also cut simple squares and circles, if preferred.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>I'm making stickers for a club, and I need more than 100 stickers. Is this allowed?</AccordionTrigger>
            <AccordionContent>
            Please contact an eboard member for further details.
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
      </div>

      {/* Third dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        3D Printers
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-3"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>What kind of filament am I allowed to use?</AccordionTrigger>
            <AccordionContent>
            PLA, PETG, ABS, PLA+, and TPU are allowed. See below for allowed brands. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>What brands of filament am I allowed to use?</AccordionTrigger>
            <AccordionContent>
            Matterhackers, eSun, Prusament, Polymaker, Hatchbox, and Overture.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>I don't have filament. Can I use the Forge's?</AccordionTrigger>
            <AccordionContent>
            Yes. The Forge stocks Matterhackers PLA, TPU, and PETG in black and white. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>How much does filament cost?</AccordionTrigger>
            <AccordionContent>
            5 Cents a gram. However, printing is free if you bring your own approved filament. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-5">
            <AccordionTrigger>What kind of file should I use for printing?</AccordionTrigger>
            <AccordionContent>
            Bring an STL on a USB-accessible computer, or a USB flash drive.
            </AccordionContent>
          </Accordion.Item>
          
          <Accordion.Item className="AccordionItem" value="item-6">
            <AccordionTrigger>I have [filament type] or [filament brand] that is not on the approved filaments list. Can I still use it?</AccordionTrigger>
            <AccordionContent>
            Ask a room manager if this filament is OK to use.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-7">
            <AccordionTrigger>Do you have multicolor printing?</AccordionTrigger>
            <AccordionContent>
            Yes! We have a 5 toolhead Prusa XL that can print up to 5 colors. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-8">
            <AccordionTrigger>Do you have a resin printer?</AccordionTrigger>
            <AccordionContent>
            Yes! We recently acquired a new Formlabs Form 4 resin printer. See below for details.
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
      </div>    

      {/* Fourth dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        Laser Cutter
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-4"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>What materials can I use on the laser cutter?</AccordionTrigger>
            <AccordionContent>
            Most types of wood and paper can be used. Check with a volunteer or room manager before printing.
            Do NOT cut: PVC, corrugated cardboard, arsenic, asbestos, or people.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>Can the laser cutter engrave materials?</AccordionTrigger>
            <AccordionContent>
            Yes! It can engrave laptops, rocks, bread, and most other flat, solid objects. 
            Do NOT laser engrave people. It hurts. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>Does the Forge stock laser cutting materials?</AccordionTrigger>
            <AccordionContent>
            No, but we sometimes have free used material in the back room. If some of your material is still usable, we appreciate people leaving it in the back room intead of throwing it away.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>What size is the laser cutter bed?</AccordionTrigger>
            <AccordionContent>
            The bed is 35.4'' W x 23.6'' H.
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
      </div> 

      {/* Fifth dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        Resin Printer
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-5"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>What kinds of resin does the Forge stock?</AccordionTrigger>
            <AccordionContent>
            Clear, Fast, High Temp, Grey, and Rigid 10k.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>Can the laser cutter engrave materials?</AccordionTrigger>
            <AccordionContent>
            Yes! It can engrave laptops, rocks, bread, and most other flat, solid objects. 
            Do NOT laser engrave people. It hurts. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>How much does using the resin printer cost?</AccordionTrigger>
            <AccordionContent>
            20 cents a mL for generic resin (clear, fast, and grey) and 30 cents a mL for specialty (all other resins).
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>Do you have [specialty resin?]</AccordionTrigger>
            <AccordionContent>
            If it's not listed here, ask a room manager for more details. 
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
      </div>

      {/* Sixth dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        Sewing machine
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-6"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>What kinds of sewing machines do you have?</AccordionTrigger>
            <AccordionContent>
            The Forge has a standard Brother sewing machine and an embroidery machine.
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>How do I use the embroidery machine?</AccordionTrigger>
            <AccordionContent>
            Ask Mikiel or Lucas.
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
      </div>

      {/* Seventh dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        Button Maker
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-7"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>You have one of those?</AccordionTrigger>
            <AccordionContent>
            Yep. 
            </AccordionContent>
          </Accordion.Item>

          <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>How do I use it?</AccordionTrigger>
            <AccordionContent>
            Ask an eboard member. 
            </AccordionContent>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      {/* Eighth dropdown group */}
      <div className="accordion-section">
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px", 
          fontSize: "clamp(20px, 4vw, 24px)" 
        }}>
        Drawing Tablet
        </h2>
        <Accordion.Root
          className="AccordionRoot"
          type="single"
          defaultValue="item-8"
          collapsible
        >
          <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>How do I use the drawing tablet?</AccordionTrigger>
            <AccordionContent>
            It's free to use, if no one else is using it. Ask a volunteer.
            </AccordionContent>
          </Accordion.Item>

        </Accordion.Root>
          </div>
            <h2 style={{ 
            textAlign: "center", 
            marginBottom: "20px", 
            fontSize: "18px", 
            position: "relative", 
            top: 0, 
            background: "#eeeeee", 
            zIndex: 3,
            width: "100%" 
            }}>
            If you have any questions, Please visit the Forge and ask the volunteers!
            </h2>
    </div>

  </div>
);

export default AccordionDemo;
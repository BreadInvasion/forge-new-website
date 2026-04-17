import svgPaths from "./svg-arh9ygo0o3";
import imgAnvilWithBenchysRight1 from "figma:asset/34aecddf182b9cb4f37be55221e4f234210a668b.png";
import imgStickersRemovebgPreview1 from "figma:asset/2e1b756b3f43ae075de316bcf436e8e4848f1e57.png";

function Frame() {
  return (
    <div className="-translate-y-1/2 absolute h-[375px] left-[127px] top-[calc(50%-126.5px)] w-[477px]" data-name="Frame">
      <div className="absolute font-['Funnel_Display:Bold',sans-serif] leading-[0] left-0 not-italic text-[100px] text-white top-[calc(50%-187.5px)] whitespace-nowrap">
        <p className="leading-[1.25] mb-0 whitespace-pre">Build.</p>
        <p className="leading-[1.25] mb-0 whitespace-pre">{`  Create.`}</p>
        <p className="leading-[1.25] whitespace-pre">{`      Invent.`}</p>
      </div>
    </div>
  );
}

function StyleRulerIn() {
  return (
    <div className="h-[70px] relative w-[850px]" data-name="Style=Ruler IN 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 850 70">
        <g id="Style=Ruler IN 1">
          <path d={svgPaths.p2f179bc0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="-translate-x-1/2 absolute bg-gradient-to-r from-[#2d4a80] from-[10.096%] h-[826px] left-1/2 overflow-clip to-[#a51c1c] top-[63px] w-[1440px]" data-name="Hero Section">
      <div className="-translate-y-1/2 absolute h-[792px] right-0 top-[calc(50%+3px)] w-[920px]" data-name="anvil_with_benchys_right 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[103.28%] left-[-58.18%] max-w-none top-[-2.27%] w-[158.18%]" src={imgAnvilWithBenchysRight1} />
        </div>
      </div>
      <div className="absolute h-[868px] left-0 top-0 w-[1440px]" />
      <Frame />
      <div className="-translate-y-1/2 absolute flex h-[850px] items-center justify-center left-[-3px] top-[calc(50%-7px)] w-[70px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 -scale-y-100 flex-none">
          <StyleRulerIn />
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] left-[calc(50%-491px)] not-italic text-[35px] text-white top-[calc(50%+220px)] whitespace-nowrap">
        <p className="leading-[normal] whitespace-pre">
          3D Print
          <br aria-hidden="true" />
          {`   Laser Cut`}
          <br aria-hidden="true" />
          {`       Sticker Print`}
          <br aria-hidden="true" />
          {`            and Much More!`}
        </p>
      </div>
    </div>
  );
}

function StyleRulerIn1() {
  return (
    <div className="h-[70px] relative w-[737px]" data-name="Style=Ruler IN 2">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 737 70">
        <g clipPath="url(#clip0_1_110)" id="Style=Ruler IN 2">
          <path d={svgPaths.pc09a680} fill="var(--fill-0, #A51C1C)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_110">
            <rect fill="white" height="70" width="737" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-y-1/2 absolute bg-[#a51c1c] border-2 border-[#111c36] border-solid h-[50px] left-[1100px] rounded-[10px] top-[calc(50%+0.5px)] w-[260px]" data-name="Frame">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Funnel_Display:SemiBold',sans-serif] justify-center leading-[0] left-1/2 not-italic text-[30px] text-center text-white top-1/2 whitespace-nowrap">
        <p className="leading-[normal]">Get Started</p>
      </div>
    </div>
  );
}

function Frame4() {
  return <div className="absolute left-[282px] size-[100px] top-[-18px]" />;
}

function Frame5() {
  return (
    <div className="-translate-y-1/2 absolute h-[63px] left-[100px] rounded-[10px] top-[calc(50%+1px)] w-[931px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] left-1/2 not-italic text-[#111c36] text-[50px] text-center top-1/2 whitespace-nowrap">
        <p className="leading-[normal]">Membership is Only $20 Per Semester!</p>
      </div>
    </div>
  );
}

function InfoBar() {
  return (
    <div className="-translate-x-1/2 absolute bg-white h-[91px] left-1/2 overflow-clip top-[889px] w-[1440px]" data-name="Info Bar">
      <div className="absolute bottom-[-335px] flex h-[737px] items-center justify-center left-[-2px] w-[70px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 -scale-y-100 flex-none">
          <StyleRulerIn1 />
        </div>
      </div>
      <div className="absolute bg-[#a51c1c] h-[4px] left-0 top-0 w-[1440px]" />
      <Frame1 />
      <Frame4 />
      <div className="-translate-y-1/2 absolute bg-[#a51c1c] h-[92px] right-0 top-[calc(50%+0.5px)] w-[4px]" />
      <Frame5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[25px] items-center justify-center left-[989px] overflow-clip px-[15px] top-[calc(50%-0.5px)]">
      <div className="flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">
        <p className="leading-[normal]">Create</p>
      </div>
      <div className="flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">
        <p className="leading-[normal]">Status</p>
      </div>
      <div className="flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">
        <p className="leading-[normal]">Hours</p>
      </div>
      <div className="flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">
        <p className="leading-[normal]">FAQ</p>
      </div>
      <div className="flex h-[39px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[39px]">
            <div className="absolute inset-[-4px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 4">
                <line id="Line 2" stroke="var(--stroke-0, #2D4A80)" strokeWidth="4" x2="39" y1="2" y2="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-['Funnel_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">
        <p className="leading-[normal]">Sign In</p>
      </div>
    </div>
  );
}

function RpiLockupEngSm() {
  return (
    <div className="h-[40px] relative shrink-0 w-[197px]" data-name="RPI_Lockup_Eng_Sm 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 197 40">
        <g id="RPI_Lockup_Eng_Sm 1">
          <path d={svgPaths.p2c53c600} fill="var(--fill-0, #2D4A80)" id="Vector" />
          <path d={svgPaths.p1dc6be80} fill="var(--fill-0, #2D4A80)" id="Vector_2" />
          <path d={svgPaths.p380ae600} fill="var(--fill-0, #2D4A80)" id="Vector_3" />
          <path d={svgPaths.p375e0780} fill="var(--fill-0, #2D4A80)" id="Vector_4" />
          <path d={svgPaths.p2ffbb800} fill="var(--fill-0, #2D4A80)" id="Vector_5" />
          <path d={svgPaths.p2d4100} fill="var(--fill-0, #2D4A80)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center relative shrink-0">
      <RpiLockupEngSm />
      <div className="flex h-[50px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[50px]">
            <div className="absolute inset-[-4px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 4">
                <line id="Line 1" stroke="var(--stroke-0, #2D4A80)" strokeWidth="4" x2="50" y1="2" y2="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[37px] relative shrink-0 w-[64px]" data-name="Stickers-removebg-preview 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgStickersRemovebgPreview1} />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Funnel_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2d4a80] text-[20px] whitespace-nowrap">THE FORGE | The MILL</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center justify-center left-[13px] top-[10px]">
      <Frame6 />
      <Frame2 />
    </div>
  );
}

function NavBar() {
  return (
    <div className="-translate-x-1/2 absolute bg-white h-[72px] left-1/2 overflow-clip shadow-[0px_1px_3px_0px_rgba(0,0,0,0.06)] top-[2px] w-[1440px]" data-name="Nav Bar">
      <div className="absolute bg-white bottom-0 h-[4px] left-0 w-[1440px]" data-name="Rectangle" />
      <Frame3 />
      <Frame7 />
    </div>
  );
}

function Footer() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#111c36] h-[100px] left-1/2 top-[980px] w-[1440px]" data-name="Footer">
      <div className="absolute bg-[#a51c1c] h-[4px] left-0 top-0 w-[1440px]" data-name="Rectangle" />
      <p className="absolute font-['Familjen_Grotesk:Bold',sans-serif] font-bold leading-[normal] left-[40px] text-[14px] text-white top-[24px] whitespace-nowrap">THE FORGE | The MILL</p>
      <div className="absolute font-['Geist:Regular',sans-serif] font-normal leading-[0] left-[40px] text-[#4a6080] text-[12px] top-[46px] whitespace-nowrap">
        <p className="leading-[1.7] mb-0">Rensselaer Polytechnic Institute · School of Engineering</p>
        <p className="leading-[1.7]">110 8th St, Troy, NY 12180</p>
      </div>
      <p className="absolute font-['Familjen_Grotesk:Regular',sans-serif] font-normal leading-[normal] left-[1331px] text-[#4a6080] text-[12px] top-[44px] whitespace-nowrap">rpiforge.dev</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative size-full" data-name="Landing Page">
      <HeroSection />
      <InfoBar />
      <NavBar />
      <Footer />
    </div>
  );
}
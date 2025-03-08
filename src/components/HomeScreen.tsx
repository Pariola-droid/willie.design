import gsap from "gsap";
import React from "react";

const REELS_DATA = [
  {
    id: 1,
    title: "maker",
    img: "/images/home/b.png",
  },
  {
    id: 2,
    title: "balky",
    img: "/images/home/a.png",
  },
  {
    id: 3,
    title: "topsphere",
    img: "/images/home/c.png",
  },
  //   {
  //     id: 4,
  //     title: "dandy",
  //     img: "/images/home/d.png",
  //   },
  //   {
  //     id: 5,
  //     title: "eagle",
  //     img: "/images/home/a.png",
  //   },
  //   {
  //     id: 6,
  //     title: "fancy",
  //     img: "/images/home/c.png",
  //   },
  //   {
  //     id: 7,
  //     title: "giant",
  //     img: "/images/home/b.png",
  //   },
  //   {
  //     id: 8,
  //     title: "honey",
  //     img: "/images/home/d.png",
  //   },
  //   {
  //     id: 9,
  //     title: "indigo",
  //     img: "/images/home/b.png",
  //   },
  //   {
  //     id: 10,
  //     title: "jolly",
  //     img: "/images/home/a.png",
  //   },
];

function handleImgReel(e: React.MouseEvent<HTMLParagraphElement>) {
  const { currentTarget } = e;
  const currentTitle = currentTarget.textContent?.toLowerCase();

  const allReelImgs = gsap.utils.toArray(".reel-image");

  const currentReel = REELS_DATA.filter((reel: any) => {
    // return reel.title.toLowerCase.includes(currentTitle);
    return currentTitle?.includes(reel.title.toLowerCase());
  })[0];

  const currentImgEl: any = allReelImgs.filter((pic: any) => {
    const title = pic.getAttribute("data-title");

    return title === currentReel.title;
  })[0];

  //   Check if the current Image is the same as the  Active Image
  const activeImg: any = allReelImgs.filter((pic: any) => {
    return pic.classList.contains("active");
  })[0];

  console.log(activeImg, currentImgEl)
  console.log(allReelImgs)

  if (activeImg === currentImgEl) {
    return;
  }

  allReelImgs.forEach((reel: any) => {
    gsap.to(reel, {
      y: "100%",
    });

    reel.classList.remove("active");

    gsap.to(currentImgEl, {
      y: 0,
    });

    currentImgEl.classList.add("active");
  });
}

export default function HomeScreen() {
  return (
    <div className="h-[100vh] fixed inset-0 opacity-1 bg w-[100%] home-screen opacity-0 !text-white flex justify-between items-end pl-[16px] pr-[12px] pb-[18px]">
      {/* Container for images and current company */}
      <div className="flex flex-col">
        {/* Container for images */}
        <div className="relative  h-[250px] w-[219px] overflow-hidden">
          {REELS_DATA.map((pic, idx) => {
            return (
              <img
                src={pic.img}
                alt="project"
                data-title={pic.title}
                className={`max-w-[250px] absolute w-full h-full object-cover top-0  ${idx === 0 ? "active" : "translate-y-[100%] "} reel-image`}
              />
            );
          })}
        </div>

        {/* Current company */}
        <p className=" mt-[96px] text-[#FFFFFF99] font-[300] text-[14px] mb-[8px] ">
          Currently at Balky Studio
        </p>
      </div>

      {/* Container for bottom right */}
      <div className="flex gap-[115px]">
        {/* Container for cases */}
        <div className="flex flex-col border-[#FFFFFF3D] pl-[20px] border-l  max-w-[242px]">
          <h3 className="text-[14px]">Cases</h3>

          {/* Featured */}
          <h4 className="mt-[96px] text-[#FFFFFF99] font-[300] text-[14px] mb-[8px] ">
            Featured
          </h4>
          <p
            onMouseEnter={handleImgReel}
            className="leading-[125%] text-[20px] cursor-pointer"
          >
            The Maker Studio
          </p>
          <p
            onMouseEnter={handleImgReel}
            className="leading-[125%] text-[20px] cursor-pointer"
          >
            Balky Studio
          </p>
          <p
            onMouseEnter={handleImgReel}
            className="leading-[125%] text-[20px] cursor-pointer"
          >
            Topsphere Media
          </p>

          {/* Core Services */}
          <h4 className="mt-[57px] text-[#FFFFFF99] font-[300] text-[14px] mb-[8px]">
            Core Services
          </h4>
          <p>Web, Product and Motion</p>
          <p>Design</p>
        </div>

        {/* Container for Bio */}
        <div className="flex flex-col border-[#FFFFFF3D] border-l pl-[20px] max-w-[242px]">
          <h3 className="text-[14px]">Bio</h3>

          <h4 className="mt-[104px] text-[#FFFFFF99] font-[300] text-[14px] mb-[8px]">
            Based in Lagos
          </h4>

          <p className="leading-[125%] text-[20px]">
            Creative visual designer focused on playing with layout
            compositions, colors and typography to create immersive digital
            experiences.
          </p>
        </div>
      </div>
    </div>
  );
}

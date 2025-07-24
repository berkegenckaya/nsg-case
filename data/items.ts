// /data/items.ts

export type ItemLevelMeta = {
    level: number;
    name: string;        
    description: string; 
    image: string;       
    energyCost: number;
  };
  
  export type ItemDefinition = {
    id: string;           
    slug: string;
    maxLevel: number;     
    levels: Record<number, ItemLevelMeta>;
  };
  
  export const ITEM_DEFS: Record<string, ItemDefinition> = {
    "uzun-kilic": {
      id: "uzun-kilic",
      slug: "uzun-kilic",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gümüş Diş",
          description: "Sade, keskin bir savaş kılıcı.",
          image: "/items/kilic1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Yürek",
          description: "Can alıcı darbeler için güçlendirildi.",
          image: "/items/kilic2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Pençe",
          description: "Kralların kanını döken efsanevi keskinlik.",
          image: "/items/kilic3.svg",
          energyCost: 1,
        },
      },
    },
  
    "savas-baltasi": {
      id: "savas-baltasi",
      slug: "savas-baltasi",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Ay Parçası",
          description: "Hafif ve hızlı bir balta.",
          image: "/items/axe1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Kesik",
          description: "Derin yaralar açan büyülü çelik.",
          image: "/items/axe2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Efsane Yarma",
          description: "Tek vuruşta kale kapısı deler.",
          image: "/items/axe3.svg",
          energyCost: 1,
        },
      },
    },
  
    "buyu-asasi": {
      id: "buyu-asasi",
      slug: "buyu-asasi",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gölge Dalı",
          description: "Temel büyü asası.",
          image: "/items/sopa1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Kök",
          description: "Doğanın gücüyle titreşir.",
          image: "/items/sopa2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Kök",
          description: "Yıldızları yere indirir, zamanı büker.",
          image: "/items/sopa3.svg",
          energyCost: 1,
        },
      },
    },
  
    kalkan: {
      id: "kalkan",
      slug: "kalkan",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gümüş Siper",
          description: "Basit bir koruma aracı.",
          image: "/items/kalkan1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Zırh",
          description: "Gelen saldırıyı yansıtır.",
          image: "/items/kalkan2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Duvar",
          description: "Tanrılar bile geçemez.",
          image: "/items/kalkan3.svg",
          energyCost: 1,
        },
      },
    },
  
    "savas-cekici": {
      id: "savas-cekici",
      slug: "savas-cekici",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Taş Parçalayıcı",
          description: "Ağır ve yıkıcı.",
          image: "/items/cekic1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Ezici",
          description: "Zırhları paramparça eder.",
          image: "/items/cekic2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Hüküm",
          description: "Dünyayı çatlatır, düşmanları ezer.",
          image: "/items/cekic3.svg",
          energyCost: 1,
        },
      },
    },
  
    "egri-kilic": {
      id: "egri-kilic",
      slug: "egri-kilic",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gümüş Pençe",
          description: "Hafif ve çevik bir bıçak.",
          image: "/items/egri1.svg",
            energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Çengel",
          description: "Derin kesikler için eğildi.",
          image: "/items/egri2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Yılan",
          description: "Gölge gibi kayar, kaderi biçer.",
          image: "/items/egri3.svg",
          energyCost: 1,
        },
      },
    },
  
    "kisa-kilic": {
      id: "kisa-kilic",
      slug: "kisa-kilic",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gölge Kesik",
          description: "Hızlı saldırılar için ideal.",
          image: "/items/kısa1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Fısıltı",
          description: "Sessiz ama ölümcül.",
          image: "/items/kısa2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Dilim",
          description: "Zamanda bile iz bırakır.",
          image: "/items/kısa3.svg",
          energyCost: 1,
        },
      },
    },
  
    "buyu-kitabi": {
      id: "buyu-kitabi",
      slug: "buyu-kitabi",
      maxLevel: 3,
      levels: {
        1: {
          level: 1,
          name: "Gümüş Sayfalar",
          description: "Temel büyüleri içerir.",
          image: "/items/kitap1.svg",
          energyCost: 1,
        },
        2: {
          level: 2,
          name: "Zümrüt Kehanet",
          description: "Geleceği okur, kaderi değiştirir.",
          image: "/items/kitap2.svg",
          energyCost: 1,
        },
        3: {
          level: 3,
          name: "Altın Kitabe",
          description: "Evrenin sırlarını fısıldar, gerçekliği ezer.",
          image: "/items/kitap3.svg",
          energyCost: 1,
        },
      },
    },
  };
  
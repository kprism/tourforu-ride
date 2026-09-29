window.TOURFORU_DATA = {
  courses: [
    {
      id: "victory-road",
      category: "역사 · 트래킹",
      title: "이순신 승전길",
      location: "경상남도",
      description: "충무공 이순신 장군의 승전 현장을 따라 걷는 경남 대표 역사관광 코스",
      hero: "./assets/victory-road-demo.svg",
      featured: true,
      views: 12840,
      groups: [
        {
          id: "victory-trekking",
          title: "이순신 승전길 트래킹",
          description: "남해안의 풍경과 이순신 장군의 승전 역사를 함께 만나는 도보 여행",
          routes: [
            {
              id: "okpo",
              title: "옥포 승전길",
              area: "거제",
              distance: 8.5,
              walkHours: 3,
              transportHours: 1.5,
              views: 3281,
              difficulty: "보통",
              description: "임진왜란 첫 승전의 현장을 따라 걷는 역사 트래킹 코스",
              stops: ["옥포항", "옥포대첩기념공원", "기념관", "전망구간"],
              points: [{name:"옥포항",lat:34.8928,lng:128.6907},{name:"옥포대첩기념공원",lat:34.8904,lng:128.7136},{name:"기념관",lat:34.8908,lng:128.7146},{name:"전망구간",lat:34.8958,lng:128.7208}]
            },
            {
              id: "hansan",
              title: "한산대첩 승전길",
              area: "통영",
              distance: 10.8,
              walkHours: 4,
              transportHours: 2,
              views: 5126,
              difficulty: "보통",
              description: "한산대첩의 역사와 통영 바다를 함께 만나는 대표 코스",
              stops: ["통영항", "한산도", "제승당", "대첩 전망구간"],
              points: [{name:"통영항",lat:34.8403,lng:128.4220},{name:"한산도",lat:34.7684,lng:128.4978},{name:"제승당",lat:34.7896,lng:128.4898},{name:"대첩 전망구간",lat:34.8020,lng:128.4650}]
            },
            {
              id: "danghangpo",
              title: "당항포 승전길",
              area: "고성",
              distance: 7.2,
              walkHours: 2.5,
              transportHours: 1.5,
              views: 2149,
              difficulty: "쉬움",
              description: "당항포대첩의 흔적을 따라 가족과 함께 걷기 좋은 코스",
              stops: ["당항포관광지", "충무공 전승기념관", "해안 산책길"],
              points: [{name:"당항포관광지",lat:35.0550,lng:128.3930},{name:"충무공 전승기념관",lat:35.0540,lng:128.3920},{name:"해안 산책길",lat:35.0500,lng:128.4010}]
            },
            {
              id: "noryang",
              title: "노량 승전길",
              area: "남해",
              distance: 11.6,
              walkHours: 4.5,
              transportHours: 2,
              views: 4672,
              difficulty: "보통",
              description: "이순신 장군의 마지막 바다를 따라가는 역사·추모 트래킹",
              stops: ["노량", "충렬사", "이순신 순국공원", "남해대교 전망구간"],
              points: [{name:"노량",lat:34.9450,lng:127.8690},{name:"충렬사",lat:34.9466,lng:127.8675},{name:"이순신 순국공원",lat:34.9427,lng:127.8652},{name:"남해대교 전망구간",lat:34.9422,lng:127.8567}]
            }
          ]
        }
      ]
    },

  ],

  rides: [
    {
      id: "carnival-01",
      vehicle: "기아 카니발 하이리무진",
      type: "프리미엄 밴",
      year: "2025",
      capacity: 6,
      bags: 5,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
      guide: {
        name: "김민수",
        rating: 4.9,
        reviews: 128,
        career: "관광 운행 8년",
        guideCareer: "경남 역사관광 가이드 6년",
        languages: "한국어",
        safeTrips: 1248
      },
      maintenance: {
        last: "2026.09.12",
        mileage: "42,180km",
        next: "2026.12",
        inspection: "정상"
      },
      basePrice: 150000,
      hourly: 18000
    },

    {
      id: "staria-01",
      vehicle: "현대 스타리아 라운지",
      type: "대형 MPV",
      year: "2025",
      capacity: 8,
      bags: 7,
      image: "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?auto=format&fit=crop&w=1200&q=80",
      guide: {
        name: "박성진",
        rating: 4.8,
        reviews: 94,
        career: "관광 운행 11년",
        guideCareer: "경남 관광가이드 9년",
        languages: "한국어 · 영어",
        safeTrips: 1872
      },
      maintenance: {
        last: "2026.08.28",
        mileage: "58,420km",
        next: "2026.11",
        inspection: "정상"
      },
      basePrice: 175000,
      hourly: 20000
    },

    {
      id: "solati-01",
      vehicle: "현대 쏠라티",
      type: "미니버스",
      year: "2024",
      capacity: 14,
      bags: 12,
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      guide: {
        name: "이준호",
        rating: 4.9,
        reviews: 167,
        career: "대형차 운행 15년",
        guideCareer: "단체 관광가이드 10년",
        languages: "한국어",
        safeTrips: 2410
      },
      maintenance: {
        last: "2026.09.05",
        mileage: "71,220km",
        next: "2026.12",
        inspection: "정상"
      },
      basePrice: 230000,
      hourly: 24000
    },

    {
      id: "bus-01",
      vehicle: "45인승 프리미엄 버스",
      type: "대형버스",
      year: "2025",
      capacity: 42,
      bags: 35,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      guide: {
        name: "최영호",
        rating: 4.9,
        reviews: 211,
        career: "전세버스 운행 18년",
        guideCareer: "단체 관광 인솔 12년",
        languages: "한국어",
        safeTrips: 3184
      },
      maintenance: {
        last: "2026.09.18",
        mileage: "83,510km",
        next: "2026.12",
        inspection: "정상"
      },
      basePrice: 360000,
      hourly: 32000
    }
  ]
};

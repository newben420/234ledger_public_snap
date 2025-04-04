class GDELTCategory {
    name!: string;
    id!: number;
    themes!: string[];
}

export const GDeltCategories: GDELTCategory[] = [
    {
        name: "Politics and Governance",
        id: 1,
        themes: [
            "LEADER",
            "GENERAL_GOVERNMENT",
            "USPEC_POLITICS_GENERAL1",
            "WB_678_DIGITAL_GOVERNMENT",
            "LEGISLATION",
            "WB_831_GOVERNANCE",
            "ELECTION",
            "WB_1803_TRANSPORT_INFRASTRUCTURE",
            "WB_2490_NATIONAL_PROTECTION_AND_SECURITY",
            "TAX_FNCACT_LEADERS",
            "BAN",
            "DEMOCRACY",
            "APPOINTMENT",
            "GOV_LOCALGOV",
            "ELECTION_FRAUD",
            "GOV_REFORM",
            "CORRUPTION",
        ]
    },
    {
        name: "Others",
        id: 2,
        themes: [
            "POVERTY",
            "GEN_HOLIDAY",
            "CRISISLEX_O01_WEATHER",
            "RELIGION",
            "FOOD_SECURITY",
            "GENERAL_PUBLIC_OPINION",
            "TAX_WORLDLANGUAGES_NIGERIAN_PIDGIN_ENGLISH",
        ]
    },
    {
        name: "Judiciary, Law Enforcements and Courts",
        id: 3,
        themes: [
            "TRIAL",
            "WB_840_JUSTICE",
            "WB_1014_CRIMINAL_JUSTICE",
            "ARREST",
            "WB_832_ANTI_CORRUPTION",
            "WB_2024_ANTI_CORRUPTION_AUTHORITIES",
            "WB_2025_INVESTIGATION",
            "WB_2531_INSPECTIONS_LICENSING_AND_PERMITS",
            "CORRUPTION",
            "WB_2495_DETENTION_PRISON_AND_CORRECTIONS_REFORM",
            "WB_2203_HUMAN_RIGHTS",
            "HUMAN_RIGHTS_ABUSES",
            "JUSTICE",
            "FREESPEECH",
            "WHISTLEBLOWER",
            "FNCACT_POLICEMANS",
            "TAX_FNCACT_POLICE",
        ]
    },
    {
        name: "Business and Economy",
        id: 4,
        themes: [
            "EPU_ECONOMY",
            "WB_698_TRADE",
            "WB_2530_BUSINESS_ENVIRONMENT",
            "ECON_STOCKMARKET",
            "ECON_WORLDCURRENCIES",
            "ECON_TAXATION",
            "ECON_STOCKMARKET",
            "WB_882_MSME_FINANCE",
            "WB_337_INSURANCE",
            "WB_450_DEBT",
            "ECON_CENTRALBANK",
            "ECON_UNIONS",
            "ECON_INFLATION",
            "ECON_MONOPOLY",
            "FUELPRICES",
            "ECON_FOREIGNINVEST",
            "ECON_COST_OF_LIVING",
            "ECON_NATGASPRICE",
            "ECON_WORLDCURRENCIES_NIGERIAN_NAIRA",
            "WB_541_GOVERNMENT_INSTITUTIONS_FOR_OIL_AND_GAS",
            "WB_2289_OIL_AND_GAS_REFINING",
            "WB_545_NATIONAL_OIL_COMPANIES",
            "WB_2291_OIL_AND_GAS_DISTRIBUTION",
        ]
    },
    {
        name: "Health",
        id: 5,
        themes: [
            "GENERAL_HEALTH",
            "MEDICAL",
            "WB_621_HEALTH_NUTRITION_AND_POPULATION",
            "WB_696_PUBLIC_SECTOR_MANAGEMENT",
            "WB_635_PUBLIC_HEALTH",
            "WB_1406_DISEASES",
            "CRISISLEX_C03_WELLBEING_HEALTH",
            "UNGP_HEALTHCARE",
        ]
    },
    {
        name: "Education and Careers",
        id: 6,
        themes: [
            "EDUCATION",
            "WB_470_EDUCATION",
            "WB_1484_EDUCATION_SKILLS_DEVELOPMENT_AND_LABOR_MARKET",
            "WB_2748_EMPLOYMENT",
            "ECON_ENTREPRENEURSHIP",
            "UNEMPLOYMENT",
            "RECRUITMENT",
            "SOC_POINTSOFINTEREST_SCHOOL",
        ]
    },
    {
        name: "Crimes and Insecurity",
        id: 7,
        themes: [
            "KILL",
            "SECURITY_SERVICES",
            "WB_2433_CONFLICT_AND_VIOLENCE",
            "ARMEDCONFLICT",
            "CRISISLEX_T03_DEAD",
            "SOC_GENERALCRIME",
            "UNGP_CRIME_VIOLENCE",
            "TAX_FNCACT_CRIMINAL",
            "WB_2453_ORGANIZED_CRIME",
            "DRUG_TRADE",
            "RAPE",
            "CRIME_COMMON_ROBBERY",
            "CRIME_ILLEGAL_DRUGS",
            "HUMAN_TRAFFICKING",
            "VANDALIZE",
            "CRIME_LOOTING",
            "HUMAN_RIGHTS_ABUSES_POLICE_BRUTALITY",
        ]
    },
    {
        name: "Disasters",
        id: 8,
        themes: [
            "NATURAL_DISASTER",
            "MANMADE_DISASTER_IMPLIED",
            "DISASTER_FIRE",
            "NATURAL_DISASTER_HEAVY_RAIN",
            "NATURAL_DISASTER_DROWNED",
            "MANMADE_DISASTER_TRAFFIC_ACCIDENT",
            "MANMADE_DISASTER_CAR_CRASH",
            "NATURAL_DISASTER_DROUGHTS",
            "MANMADE_DISASTER_OIL_SPILL",
            "PIPELINE_INCIDENT",
            "MANMADE_DISASTER_MINING_DISASTER",
            "NATURAL_DISASTER_DAM_BREAK",
            "MANMADE_DISASTER_INDUSTRIAL_DISASTER",
        ]
    },
    {
        name: "Terrorism",
        id: 9,
        themes: [
            "TERROR",
            "EXTREMISM",
            "REFUGEES",
            "REBELLION",
            "KIDNAP",
            "CYBER_ATTACK",
            "INSURGENCY",
            "DISCRIMINATION_RELIGION_ANTICHRISTIAN",
        ]
    },
    {
        name: "Environment",
        id: 10,
        themes: [
            "WB_1804_AIRPORTS",
            "PUBLIC_TRANSPORT",
            "URBAN",
            "TOURISM",
            "MOVEMENT_GENERAL",
            "WB_167_PORTS",
            "RURAL",
            "WB_1809_HIGHWAYS",
            "WB_567_CLIMATE_CHANGE",
            "WATER_SECURITY",
            "ENV_SOLAR",
            "ENV_WATERWAYS",
            "ENV_CLIMATECHANGE",
            "WB_507_ENERGY_AND_EXTRACTIVES",
        ]
    },
    {
        name: "Science & Technology",
        id: 11,
        themes: [
            "WB_133_INFORMATION_AND_COMMUNICATION_TECHNOLOGIES",
            "SCIENCE",
            "SOC_EMERGINGTECH",
            "WB_376_INNOVATION_TECHNOLOGY_AND_ENTREPRENEURSHIP",
            "WB_2424_ICT_AND_FINANCIAL_SECTOR",
            "WB_1278_BUSINESS_ENTRY_AND_STARTUP",
            "WB_2457_CYBER_CRIME",
            "WB_1254_INTERNET_BANKING",
        ]
    },
    {
        name: "General and Social Media",
        id: 12,
        themes: [
            "MEDIA_MSM",
            "WB_694_BROADCAST_AND_MEDIA",
            "MEDIA_SOCIAL",
            "WB_662_SOCIAL_MEDIA",
            "SCANDAL",
            "MOVEMENT_SOCIAL",
            "MEDIA_SOCIAL",
        ]
    },
    {
        name: "Agriculture",
        id: 13,
        themes: [
            "AGRICULTURE",
        ]
    },
    {
        name: "Entertainment and Celebrities",
        id: 14,
        themes: [
            "TAX_FNCACT_ARTIST",
            "TAX_FNCACT_PRODUCER",
            "TAX_FNCACT_MUSICIAN",
            "TAX_FNCACT_ENTERTAINER",
        ]
    },
    {
        name: "Social Matters",
        id: 15,
        themes: [
            "LGBT",
            "SOC_SUICIDE",
            "STRIKE",
            "INCOME_INEQUALITY",
            "AID_ECONOMIC",
            "GOV_FOIA",
            "EMERG_DISTRESSSIGNAL",
        ]
    },
    {
        name: "Sports and Athletics",
        id: 16,
        themes: [
            "TAX_FNCACT_SPORTSMAN",
            "TAX_FNCACT_SPORTSCASTER",
            "TAX_FNCACT_SPORTS_EDITOR",
            "TAX_FNCACT_SPORTS_AGENT",
            "TAX_FNCACT_FOOTBALLER",
        ]
    },

];

export class GDELTArticle {
    url?: string;
    url_mobile?: string;
    title?: string;
    seendate?: string;
    socialimage?: string;
    domain?: string;
    language?: string;
    sourcecountry?: string;
}
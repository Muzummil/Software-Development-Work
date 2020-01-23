import * as data from '../../../.env.json';

export class ConfigService {

    // AWS
    public static BLOOVO_REST_API = data.BLOOVO_REST_API;
    public static FRONT_API = '../app/data/';

    public static DOMAIN = data.DOMAIN;

    // Invite Friends url
    public static INVITE = data.INVITE;
    public static mobileScreen = 767;
    public static tabletScreen = 999;
    public static windowSizeDivider = 770;

    // General Env Variables
    public static SHOW_EXP_HIRED = data.SHOW_EXP_HIRED;
    public static SHOW_COOP_PROGRAM = data.SHOW_COOP_PROGRAM;
    public static JOB_TITLE_FRESH = data.JOB_TITLE_FRESH;
    public static HAS_CAREERFAIR = data.HAS_CAREERFAIR;
    public static SHOW_INTERNAL_HIRING = data.SHOW_INTERNAL_HIRING;
    public static PAGE_URL = data.PAGE_URL;


    // Algolia settings
    public static ALGOLIA_SEARCH_API_KEY = data.ALGOLIA_SEARCH_API_KEY;
    public static ALGOLIA_API_KEY = data.ALGOLIA_API_KEY;
    public static ALGOLIA_JOBSEEKER_ANALYTICS_API = data.ALGOLIA_JOBSEEKER_ANALYTICS_API;
    public static ALGOLIA_APPLICATION_ID = data.ALGOLIA_APPLICATION_ID;
    public static DEFAULT_TITLE = data.DEFAULT_TITLE;

    public static SECTORS_JOBS_EN_URL = data.SECTORS_JOBS_EN_URL;
    public static COUNTRIES_JOBS_EN_URL = data.COUNTRIES_JOBS_EN_URL;
    public static CITIES_JOBS_EN_URL = data.CITIES_JOBS_EN_URL;

    public static SECTORS_ALPHA_EN_URL = data.SECTORS_ALPHA_EN_URL;
    public static COUNTRIES_ALPHA_EN_URL = data.COUNTRIES_ALPHA_EN_URL;
    public static CITIES_ALPHA_EN_URL = data.CITIES_ALPHA_EN_URL;

    public static SECTORS_JOBS_AR_URL = data.SECTORS_JOBS_AR_URL;
    public static COUNTRIES_JOBS_AR_URL = data.COUNTRIES_JOBS_AR_URL;
    public static CITIES_JOBS_AR_URL = data.CITIES_JOBS_AR_URL;

    public static SECTORS_ALPHA_AR_URL = data.SECTORS_ALPHA_AR_URL;
    public static COUNTRIES_ALPHA_AR_URL = data.COUNTRIES_ALPHA_AR_URL;
    public static CITIES_ALPHA_AR_URL = data.CITIES_ALPHA_AR_URL;

    public static STATIC_AR_URL = data.STATIC_AR_URL;
    public static STATIC_EN_URL = data.STATIC_EN_URL;

    public static COMPANIES_BY_FOLLOWERS_AR_URL = data.COMPANIES_BY_FOLLOWERS_AR_URL;
    public static COMPANIES_BY_FOLLOWERS_EN_URL = data.COMPANIES_BY_FOLLOWERS_EN_URL;

    public static PAGES_SEO_AR_URL = data.PAGES_SEO_AR_URL;
    public static PAGES_SEO_EN_URL = data.PAGES_SEO_EN_URL;
    public static META_TITLE = data.META_TITLE;
    public static META_DESC = data.META_DESC;
    public static META_URL = data.META_URL;
    public static META_IMAGE = data.META_IMAGE;

    public static CITY_ALGOLIA_TRANSLATION_URL = data.CITY_ALGOLIA_TRANSLATION_URL;
    public static COUNTRY_ALGOLIA_TRANSLATION_URL = data.COUNTRY_ALGOLIA_TRANSLATION_URL;
    public static SECTOR_ALGOLIA_TRANSLATION_URL = data.SECTOR_ALGOLIA_TRANSLATION_URL;
    public static CURRENCY = data.CURRENCY;

    public static GOOGLE_MAP_API_KEY = data.GOOGLE_MAP_API_KEY;
    public static GOOGLE_MAP_AUTH_KEY = data.GOOGLE_MAP_AUTH_KEY;
    public static SHOW_TRANSLATION = data.SHOW_TRANSLATION;
    public static SHOW_FOLDERING = data.SHOW_FOLDERING;
    public static SIGNUP_CHANNEL = data.SIGNUP_CHANNEL;
    public static SHOW_COMPANY_BRANCHES = data.SHOW_COMPANY_BRANCHES;
    public static SHOW_LOGIN_AS_HOME = data.SHOW_LOGIN_AS_HOME;
    public static SPINNER_COLOR_ONE = data.SPINNER_COLOR_ONE;
    public static SPINNER_COLOR_TWO = data.SPINNER_COLOR_TWO;
    public static SHOW_INVITE_TO_APPLY = data.SHOW_INVITE_TO_APPLY;
    public static SHOW_CITIZEN_LOCALS = data.SHOW_CITIZEN_LOCALS;
    public static SHOW_NON_DISCLOSE_SALARY = data.SHOW_NON_DISCLOSE_SALARY;
    public static GOOGLE_TAG_MANAGER_CODE = data.GOOGLE_TAG_MANAGER_CODE;
    public static SHOW_GOOGLE_ANALYTICS = (data.SHOW_GOOGLE_ANALYTICS === 'true');

    public static expiremin = 60;
    public static indeedExpiremin = 30;
    public static jobseekerPath = 'job-seeker';

    public static langPathHash = { arabic: 'ar', english: '' };
    public static langHash = { arabic: 'ar', english: 'en' };
    public static langPath = 'ar';
    public static langMapper = { ar: 'arabic', en: 'english' };

    public static userId: any;

    public static authKey;
    // image source changed to env.json
    public static shareImage =
        ConfigService.DOMAIN + 'assets/images/custom-images/logo_1200x627.jpg';

    public static publicRoutes = [
        '',
        '/candidate-elevator',
        '/employer_branding',
        '/employer_features',
        '/employer_jobs',
        '/employer_pricing',
        '/employer_request_demo',
        '/' + ConfigService.langHash['arabic'],
        '/' + ConfigService.langHash['arabic'] + '/candidate-elevator',
        '/' + ConfigService.langHash['arabic'] + '/employer_branding',
        '/' + ConfigService.langHash['arabic'] + '/employer_features',
        '/' + ConfigService.langHash['arabic'] + '/employer_jobs',
        '/' + ConfigService.langHash['arabic'] + '/employer_pricing',
        '/' + ConfigService.langHash['arabic'] + '/employer_request_demo'

    ];
    public static titles = {
        blogs: 'Blogs',
        jobs: 'Jobs',
        companies: 'Companies',
        dashboard: 'Dashboard',
        settings: 'Settings'
    };

    public static getNodeAPI(): string {
        return this.BLOOVO_REST_API;
    }

    public static getAlgoliaAnalyticAPI() {

        return this.ALGOLIA_JOBSEEKER_ANALYTICS_API;
    }

    public static getAlgoliaSearchKey() {

        return this.ALGOLIA_SEARCH_API_KEY;
    }

    public static getAlgoliaKey() {

        return this.ALGOLIA_API_KEY;
    }

    public static getAlgoliaAppId() {

        return this.ALGOLIA_APPLICATION_ID;

    }

    public static getDomain(): string {

        return this.DOMAIN;
    }

    public static getInviteURL(): string {
        return this.INVITE;
    }

    public static getAPI(serverType: string = 'api'): string {
        if (serverType != 'api') {
            return this.FRONT_API;
        }
        return this.BLOOVO_REST_API;
    }

    public static getBloovoAPI(): string {
        return this.getNodeAPI();
    }

}

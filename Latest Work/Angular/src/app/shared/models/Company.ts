import { Job } from '../../jobseekers/job/models/Job';

export class Company {

    public id: number;
    public duration: string;
    public name: string;
    public name_url: string;
    public text: string;
    public contactEmail: string;
    public summary: string;
    public sectorId: string;
    public sector: any;
    public functionalArea: string;
    public functionalAreaId: number;
    public facebookUrl: string;
    public linkedInUrl: string;
    public googlePlusUrl: string;
    public twitterUrl: string;
    public follower: number;
    public followingFlag: boolean = false;
    public jobsOpen: number;
    public maleCount: number;
    public femaleCount: number;
    public establishmentDate: Date;
    public profileImage: string;
    public coverImage: string;
    public coverScreenShot: string;
    public coverType: string;
    public managementVideo: string;
    public addressLine: string;
    public addressLine2: string;
    public poBox: string;
    public ownerDesignation: string;
    public ownerName: string;
    public isPremium: string;
    public cityId: string;
    public city: any;
    public countryCode: string;
    public country: any;
    public websiteUrl: string;
    public phoneNo: string;
    public faxNo: string;
    public lat: string;
    public long: string;
    public companyType: string;
    public companyTypeId: number;
    public jobs_count: number;
    public companySizeId: number;
    public companySize: string;
    public classification: string;
    public classificationId: number;
    public aboutUs: string;
    public pictures: CompanyPicture[] = Array();
    public team: Team[] = Array();
    public selectedFlag: boolean = false;
    public jobList: Job[] = Array();

}

export class Team {
    id: number;
    name: string;
    designation: string;
    profileImage: string;
    profileVideo: string;
    linkedinUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    googlePlusUrl: string;

}

export class CompanyPicture {
    id: number;
    name: string;
    description: string;
    image_url: string;
    image_thumb_url: string;
}
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigService } from '../../shared/config.service';
import { Router } from '@angular/router';
import { AccountService } from '../account/services/account.service';

/**
 * Allows us to change various SEO-relevant items in the HTML header.
 */
declare let ga: Function;
declare let dataLayer;

@Injectable()
export class DomManupilationService {

    /**
     * Element "<head>" of the HTML document.
     */
    public static seoList = {};
    public static altList = {};
    public headElement: HTMLElement;
    public bodyElement: HTMLElement;
    public firstLoadFlag: boolean = true;
    public pageOrientationHash = {en: 'ltr', ar: 'rtl'};

    /*
     The hash for the Seo URLs
     {URL : hash value}
     URL => the last part of the url
     hash value : name of the page .This name is used to identify the page in the code.
     NOTE : URLS may change but hash will never change
     */

    public seoHash = {
        '': 'home',
        'jobs': 'jobs',
        'about': 'about',
        'contactus': 'contactus',
        'blog': 'blog_list',
        '404': '404',
        'package_head': 'package_head',
        'payment_list': 'payment_list',
        'signup-jobseeker': 'signup-jobseeker',
        'companies': 'company_list',
        'candidate-elevator': 'elevator_pitch',
        'terms': 'terms_conditions',
        'policy': 'privacy_policy',
        'site-map': 'site_map',
        'sector': 'jobs_sector',
        'country': 'jobs_country',
        'signup_employer?step=1': 'signup_employer_one',
        'signup_employer?step=2': 'signup_employer_two',
        'signup_employer?step=3': 'signup_employer_three',
        'login': 'login',
        'forgot-password': 'forgot_password',
        'resend-confirmation': 'resend_confirmation',
        'change-password': 'change_password',
    };

    public seoListObj = new BehaviorSubject(null);
    public altListObj = new BehaviorSubject({});

    /**
     * Constructor.
     */
    constructor(
        @Inject(DOCUMENT) private document,
        private router: Router,
        private titleService: Title) {

        this.headElement = this.document.head;
        this.bodyElement = this.document.body;

    }

    public setPaginationSeo(preUrl = '', nextUrl = '') {

        let linkFromElement = this.getOrCreateLinkRelElement('prev');
        linkFromElement.setAttribute('href', preUrl);

        let propertyFRomElement = this.getOrCreateMetaPropertyElement('og:prev');
        propertyFRomElement.setAttribute('content', preUrl);

        let linkToElement = this.getOrCreateLinkRelElement('next');
        linkToElement.setAttribute('href', nextUrl);

        let propertyToElement = this.getOrCreateMetaPropertyElement('og:next');
        propertyToElement.setAttribute('content', nextUrl);

    }

    public setCommonSeo() {
        let title = ConfigService.DEFAULT_TITLE;
        let description = ConfigService.META_DESC;
        this.setMeta('title', title);
        this.setDescription(description);
        this.setMeta('description', description);
        this.setPageTitle(title);

    }

    /**
     * Set the page seo
     * @param page
     * @param text1 pipe seperated
     * @param text2 pipe seperated
     * @param text3 pipe seperated
     */
    public setPageSeo(page = 'home', pageUrl = '', text1 = null, text2 = null, text3 = null,
                      canonicalFlag = false) {

        if (canonicalFlag) {
            this.setUrl(ConfigService.getDomain() + pageUrl);

        } else {
            this.setUrl('');
        }

        this.seoListObj.subscribe((val) => {
            let title = ConfigService.DEFAULT_TITLE;
            if (val && val[page]) {
                title = (text1 && text2 && text3) ? val[page]['common']['title']
                    + ' | ' + text1 + ' | ' + text2 + ' | ' +
                    text3 : (text1 && text2) ? val[page]['common']['title'] + ' | ' + text1 + ' | '
                    + text2 : (text1) ? val[page]['common']['title'] + ' | ' +
                    text1 : val[page]['common']['title'];

                title = (title === '') ? ConfigService.DEFAULT_TITLE : title;

                this.setPageTitle(title);
                this.setMeta('title', title);
                val[page]['meta_tags'].forEach((seltag) => {
                    let desc = (text1 && text2 && text3) ? seltag['description'] + ' | ' + text1
                        + ' | ' + text2 + ' | ' + text3 : (text1 && text2) ? seltag['description']
                        + ' | ' + text1 + ' | ' + text2 : (text1) ? seltag['description'] + ' | ' +
                        text1 : seltag['description'];

                    this.setMeta(seltag['name'].trim(), desc);

                });

                // this.setMeta('title',title);

                if (this.firstLoadFlag) {
                    this.firstLoadFlag = false;
                }

            } else if (val != null) {
                this.setMeta('title', ConfigService.META_TITLE);
                this.setMeta('description', ConfigService.META_DESC);
                this.setPageTitle(ConfigService.META_TITLE);
            }
            this.getLoadGA();
            if (process.env.NODE_ENV === 'production'  && ConfigService.SHOW_GOOGLE_ANALYTICS) {
                dataLayer.push({
                    event: 'virtualPageView',
                    pagePath: ConfigService.getDomain() + pageUrl,
                    pageTitle: title
                });
            }
            window['prerenderReady'] = true;
        });
    }

    public strip(html) {
        let tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    public setDynamicPageSeo(strList = [], descString = '', pageUrl = '', canonicalFlag = true) {
        let title = ' | ' + ConfigService.DEFAULT_TITLE;
        let description = '';
        title = (strList.length === 0) ? ConfigService.DEFAULT_TITLE : strList.join(' | ') + title;

        // Only first 2 lines are to be selected from the content

        let descList = this.strip(descString).split('.');
        descList.forEach((val, ind) => {
            if (ind < 2) {
                description += val + '.';
            }
        });

        this.setMeta('title', title);
        this.setDescription(description);
        this.setMeta('description', description);
        this.setPageTitle(title);

        if (canonicalFlag) {
            this.setUrl(ConfigService.getDomain() + pageUrl);
        } else {
            this.setUrl('');
        }
        this.getLoadGA();
        if (process.env.NODE_ENV === 'production'  && ConfigService.SHOW_GOOGLE_ANALYTICS) {
            dataLayer.push({
                event: 'virtualPageView',
                pagePath: ConfigService.getDomain() + pageUrl,
                pageTitle: title
            });
        }

        window['prerenderReady'] = true;
    }

    public getAltTag(page = 'home', imageName = '') {

        let returnObs = new BehaviorSubject(null);

        this.altListObj.subscribe((alt) => {

            if (alt[page]) {
                alt[page].forEach((selAlt) => {

                    if (selAlt['name'] === imageName) {
                        returnObs.next(selAlt['alt']);
                    }
                });

            }

        });
        return returnObs;

    }

    public getLoadGA() {

        if (AccountService.firstLoadSEO) {
            AccountService.firstLoadSEO = false;
            if (process.env.NODE_ENV === 'production' && ConfigService.SHOW_GOOGLE_ANALYTICS) {

                // Header

                let elementg = this.document.createElement('script');
                let func = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','` + ConfigService.GOOGLE_TAG_MANAGER_CODE + `');`;

                elementg.innerHTML = func;
                this.headElement.appendChild(elementg);

                // Body
                let elementd = this.document.createElement('noscript');

                let elementc = this.document.createElement('iframe');

                elementc.setAttribute('src',
                    'https://www.googletagmanager.com/ns.html?id=' +
                    ConfigService.GOOGLE_TAG_MANAGER_CODE);
                elementc.style.width = '0';
                elementc.style.height = '0';
                elementc.style.display = 'none';
                elementc.style.visibility = 'hidden';

                elementd.appendChild(elementc);
                this.bodyElement.appendChild(elementd);
            }

        }

    }

    public getSeoBody() {

        let elementa = this.document.createElement('script');
    }

    public setDescription(description: string) {
        let nameElement = this.getOrCreateMetaNameElement('description');
        nameElement.setAttribute('content', description);

        let propertyElement = this.getOrCreateMetaPropertyElement('og:description');
        propertyElement.setAttribute('content', description);
    }

    public setImage(imageUrl = ConfigService.shareImage) {
        // image source changed to env.json see head-config.common.js
        // let propertyElement = this.getOrCreateMetaPropertyElement('og:image');
        // propertyElement.setAttribute('content', imageUrl);
    }

    public setTitle(title: string) {
        this.titleService.setTitle(title);

        let nameElement = this.getOrCreateMetaNameElement('title');
        nameElement.setAttribute('content', title);

    }

    public setMeta(name: string, val: string) {

        let nameElement = this.getOrCreateMetaNameElement(name);
        nameElement.setAttribute('content', val);

        nameElement = this.getOrCreateMetaNameElement('og:' + name);
        nameElement.setAttribute('content', val);

        nameElement = this.getOrCreateMetaPropertyElement('og:' + name);
        nameElement.setAttribute('content', val);
    }

    public setPageTitle(val) {

        this.titleService.setTitle(val);
    }

    public setUrl(url: string) {

        let linkElement = this.getOrCreateLinkRelElement('canonical');
        linkElement.setAttribute('href', url);

        let propertyElement = this.getOrCreateMetaPropertyElement('og:url');
        propertyElement.setAttribute('content', url);
    }

    public setchangeOrientation(mode = 'en') {

        let element: HTMLElement;
        element = this.document.querySelector('app');
        element.setAttribute('dir', this.pageOrientationHash[mode]);
    }

    public setRobots(robots: string) {
        let nameElement = this.getOrCreateMetaNameElement('robots');
        nameElement.setAttribute('content', robots);
    }

    public getCustomSeo(title= ConfigService.META_TITLE, description=  ConfigService.META_DESC) {
        this.setMeta('title', title);
        this.setMeta('description', description);
        this.setPageTitle(title);
    }

    /**
     * Get the HTML <meta> element with the specified "name" attribute value,
     * or create it if it does not exist.
     *
     * @param name
     * @returns {HTMLElement}
     */
    private getOrCreateMetaNameElement(name: string): HTMLElement {
        let element: HTMLElement;
        element = this.document.querySelector('meta[name="' + name + '"]');
        if (element === null) {
            element = this.document.createElement('meta');
            element.setAttribute('name', name);
            this.headElement.appendChild(element);
        }
        return element;
    }

    /**
     * Get the HTML <meta> element with the specified "property" attribute value,
     * or create it if it does not exist.
     *
     * @param name
     * @returns {HTMLElement}
     */
    private getOrCreateMetaPropertyElement(name: string): HTMLElement {
        let element: HTMLElement;
        element = this.document.querySelector('meta[property="' + name + '"]');
        if (element === null) {
            element = this.document.createElement('meta');
            element.setAttribute('property', name);
            this.headElement.appendChild(element);
        }
        return element;
    }

    /**
     * Get the HTML <link> element with the specified "rel" attribute value,
     * or create it if it does not exist.
     *
     * @param name
     * @returns {HTMLElement}
     */
    private getOrCreateLinkRelElement(name: string): HTMLElement {
        let element: HTMLElement;
        element = this.document.querySelector('link[rel="' + name + '"]');
        if (element === null) {
            element = this.document.createElement('link');
            element.setAttribute('rel', name);
            this.headElement.appendChild(element);
        }
        return element;
    }
}

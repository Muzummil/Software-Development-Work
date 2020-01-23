import { browser, by, element,protractor } from 'protractor';
import 'tslib';


describe('App Desktop screen', () => {

    //Before any test this id must be incremented
    let emailId = "johndoedesktop11@mailinator.com";
    let password = "test1234";

    beforeEach(async () => {

        var width = 1400;
        var height = 890;
        browser.driver.manage().window().setSize(width, height);
        await browser.get('/');
    });


    /**
     * Will test if the error message shows up with the correct message if form is empty
     */
    it('Sign in Jobseeker Wrong credentials ', async () => {


        await login("wrongemail@email.com",password);
        await browser.sleep(2000);
        let subject = await element(by.className('error-signin-e2e')).getAttribute('innerHTML');

        let results  = ['Sorry! Authentication Failed',
                        'Sorry! Your account is inactive. To activate it, please contact us.',
                        'Sorry! This is an invalid email.',
                        'Sorry! You have entered a wrong password.',
                        'Sorry! Your account is not confirmed. To confirm it, please click on the confirmation link sent to your email, or click here to request a new link.'
                       ];

        expect(results).toContain(subject.trim());

    });

    let login = async function (emailId,password) {
        var signupBoxOpenButton = await element(by.className('sign-in-link-desk'));
        await signupBoxOpenButton.click();
        await browser.sleep(5000);
        await element(by.css('.sign form input[formcontrolname=username]')).sendKeys(emailId);
        await element(by.css('.sign form input[formcontrolname=user_password]')).sendKeys(password);

        var signinButton = await element(by.className('login-user-button-e2e'));
        await signinButton.click();
    };



})

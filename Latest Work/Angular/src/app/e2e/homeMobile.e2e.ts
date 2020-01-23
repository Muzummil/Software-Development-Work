import { browser, by, element,protractor } from 'protractor';
import 'tslib';


describe('App Mobile screen', () => {

    //Before any test this id must be incremented
  let  emailId = "johndoemobile20@mailinator.com";

  beforeEach(async () => {

      var width = 412;
      var height = 732;
      browser.driver.manage().window().setSize(width, height);
      await browser.get('/');
  });


    /**
     * Will test if the error message shows up with the correct message if form is empty
     */
    it('Sign up Required fields Mobile  ', async () => {


        var signupBoxOpenButton = await element(by.className('sign-in-mobile'));
        await signupBoxOpenButton.click();


        var signupButton = await element(by.className('home-signup'));
        await signupButton.click();
        await browser.sleep(1000);
        let subject = await element(by.className('signup-missing-error')).getAttribute('innerHTML');
        // await browser.sleep(150000);
        let result  = 'There are missing fields on the top. Please fill them before continuing.';

        expect(subject.trim()).toEqual(result);

    });




    /**
     * Will test if the success message shows up correctly if all details are filled correctly and submitted
     */
    it('Sign up Successful Mobile  ', async () => {


        var signupBoxOpenButton = await element(by.className('sign-in-mobile'));
        await signupBoxOpenButton.click();


        var signupButton = await element(by.className('home-signup'));
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=first_name]')).sendKeys("John");
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=last_name]')).sendKeys("Doe");
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=email]')).sendKeys(emailId);
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=password]')).sendKeys("test1234");


        await signupButton.click();

        await browser.sleep(5000);
        let subject = await element(by.className('signup-success')).getAttribute('innerHTML');

        let result  = "Your Account has been created successfully. Please check your Inbox &amp; confirm your Email.";

        expect(subject.trim()).toEqual(result);

    });


    /**
     * Will test if the error message shows up with the correct message if email is taken
     */
    it('Sign up Email Taken Mobile  ', async () => {


        var signupBoxOpenButton = await element(by.className('sign-in-mobile'));
        await signupBoxOpenButton.click();


        var signupButton = await element(by.className('home-signup'));
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=first_name]')).sendKeys("John");
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=last_name]')).sendKeys("Doe");
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=email]')).sendKeys("johndoe@mailinator.com");
        await element(by.css('.jobseeker_signup_form form input[formcontrolname=password]')).sendKeys("test1234");


        await signupButton.click();
        // await browser.sleep(130000);
        await browser.sleep(2000);
        let subject = await element(by.className('signup-server-error')).getAttribute('innerHTML');
        // await browser.sleep(150000);
        let result  = 'Email has already been taken.';

        expect(subject.trim()).toEqual(result);

    });



    it('LinkedIn Login is present on Mobile  ', async () => {
        var signupBoxOpenButton = await element(by.className('sign-in-mobile'));
        await signupBoxOpenButton.click();
        await browser.sleep(1000);
        let elmt = await element(by.className('linkedInSignup')).isPresent();
        expect(elmt).toBe(true); // Passes

    });


    it('Google Login is present on Mobile  ', async () => {

        var signupBoxOpenButton = await element(by.className('sign-in-mobile'));
        await signupBoxOpenButton.click();
        await browser.sleep(1000);
        let elmt = await element(by.className('googleSignup')).isPresent();
        expect(elmt).toBe(true); // Passes
    });

});

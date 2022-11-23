package test;// Generated by Selenium IDE

import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.events.EventFiringWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import runner.SeleniumTestRunner;

// run junit test in eclispe: class file must be in src folder
// add: system.setProperty, InterruptedException
// class must start or end with "Test"
// must set sourcedirectory and testdirectory in pom

// *** Regular maintenance is required for all locators (locators can be changed with updated code) ***

@RunWith(SeleniumTestRunner.class)
public final class TestLoginAndNavigation {

  public static String login = System.getenv().getOrDefault("LOGIN", "super.admin@intelletive.com");
  public static String password = System.getenv().getOrDefault("PASSWORD", "123456");

  @Test
  public void shouldSupportLoginAndNavigation() throws Exception {
      // wait until element is visible
      EventFiringWebDriver driver = SeleniumTestRunner.driver;
      WebDriverWait myWaitVar = new WebDriverWait(driver, 4);

      driver.get(SeleniumTestRunner.baseURL + "/public/login");
      Actions action = new Actions(driver);

      // move to auth box -> click -> find Local -> click
      action.moveToElement(driver.findElement(By.id("authenticationmethod"))).click().sendKeys("Local").sendKeys(Keys.ENTER).click().build().perform();
      // enter credentials
      driver.findElement(By.id("email")).sendKeys(login);
      driver.findElement(By.id("password")).sendKeys(password);
      driver.findElement(By.id("submit\'")).click();

      // sleep to load page
      Thread.sleep(5000);

      // Start navigation of the website
      // go to the default-cluster
      driver.findElement(By.xpath("//mat-card/div/span[contains(text(),'default-cluster')]")).click();
      // go to Cluster Info
      driver.findElement(By.xpath("//mat-list/a[@title='Cluster Info']")).click();
      // go to Images
      driver.findElement(By.xpath("//mat-list/a[@title='Images']")).click();
      // go to Workloads
      driver.findElement(By.xpath("//mat-list/a[@title='Workloads']")).click();
      // go to Gatekeeper
      driver.findElement(By.xpath("//mat-list/a[@title='GateKeeper']")).click();
      // go to KS
      driver.findElement(By.xpath("//mat-list/a[@title='KubeSec']")).click();
      // go to KH
      //driver.getTitle().contains("kube Hunter");
      driver.findElement(By.xpath("//mat-list/a[@title='Kube Hunter']")).click();
      // go to KB
      //driver.getTitle().contains("kube Bench");
      driver.findElement(By.xpath("//mat-list/a[@title='Kube Bench']")).click();
      // go to Reports
      driver.findElement(By.xpath("//mat-list/a[@title='Reports']")).click();

      // select organization setting
      driver.findElement(By.cssSelector(".organization-settings-text")).click();
      // select Organization
      driver.findElement(By.xpath("//mat-list/a[@title='Organization']")).click();
      // select Licenses
      driver.findElement(By.xpath("//mat-list/a[@title='License']")).click();
      // select Policies
      driver.findElement(By.xpath("//mat-list/a[@title='Policies']")).click();
      // select Exceptions
      driver.findElement(By.xpath("//mat-list/a[@title='Exceptions']")).click();
      // select Sign On Methods
      //driver.getTitle().contains("Sign On Methods");
      driver.findElement(By.xpath("//mat-list/a[@title='Sign On Methods']")).click();
      // select Docker Registeries
      driver.findElement(By.xpath("//mat-list/a[@title='Docker Registries']")).click();
      // select API Key Management
      driver.findElement(By.xpath("//mat-list/a[@title='API Key Management']")).click();
      // select Audit Logs
      driver.findElement(By.xpath("//mat-list/a[@title='Audit Logs']")).click();

      // click on profile and log out
      driver.findElement(By.xpath("//span[contains(@class, 'mat-menu-trigger')]/img[contains(@class, 'profile')]")).click();
      driver.findElement(By.xpath("//span[contains(normalize-space(), 'Sign Out')]")).click();

  }
}

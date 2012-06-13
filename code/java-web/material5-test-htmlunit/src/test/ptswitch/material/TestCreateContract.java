package test.ptswitch.material;

import java.io.IOException;
import java.net.MalformedURLException;

import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlPasswordInput;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;

public class TestCreateContract {

	public static void main(String args[]) throws FailingHttpStatusCodeException, MalformedURLException, IOException {
		WebClient webClient = new WebClient();
		HtmlPage pageLogin = webClient.getPage("http://localhost:8080/material5/user/login");
		HtmlForm form = pageLogin.getFormByName("login");
		HtmlTextInput username = form.getInputByName("u_username");
		HtmlPasswordInput password = form.getInputByName("u_password");
		HtmlButton button = form.getButtonByName("submit");
		username.setValueAttribute("hxzon");
		password.setValueAttribute("hxzon");
		HtmlPage pageAfterLogin = button.click();
		HtmlPage pageCreateContract = webClient.getPage("http://localhost:8080/material5/contract/create");
		form = pageCreateContract.getFormByName("form");
		HtmlTextInput supplier = form.getInputByName("c_supplier");
		button = form.getButtonByName("submit");
		supplier.setValueAttribute("小王供应商");
		HtmlPage pageViewContract = button.click();
		String url = pageViewContract.getUrl().toString();
		String contractId = url.substring(url.lastIndexOf('/'));
		System.out.println("create contract,url=" + url);

	}
}

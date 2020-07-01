package nl.group.wms;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class AddSwagger {

	@Bean
	public Docket swaggerConfiguration() {
		//return a prepared Docket instance
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.apis(RequestHandlerSelectors.basePackage("nl.group.wms"))
				.build()
				.apiInfo(new ApiInfo("Warehouse Management System", "Project n.a.v. het traineeship tot Java programmeur", 
						"1.0", null, null, 
						null, null, Collections.emptyList()));
		
	}
}

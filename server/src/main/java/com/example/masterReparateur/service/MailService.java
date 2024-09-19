package com.example.masterReparateur.service;

import org.springframework.stereotype.Service;

import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.NotificationEmail;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;

@Service
@AllArgsConstructor
@Slf4j
class MailService {

	private final JavaMailSender mailSender;
	private final MailContentBuilder mailContentBuilder;

	@Async
	void sendMail(NotificationEmail notificationEmail) {

		MimeMessagePreparator messagePreparator = mimeMessage -> {
			MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
			messageHelper.setFrom("springreddit@email.com");
			messageHelper.setTo(notificationEmail.getRecipient());
			messageHelper.setSubject(notificationEmail.getSubject());
			messageHelper.setText(mailContentBuilder.build(notificationEmail.getBody()));

			// SimpleMailMessage messageHelper = new SimpleMailMessage();
			// messageHelper.setFrom("springreddit@email.com");
			// messageHelper.setTo(notificationEmail.getRecipient());
			// messageHelper.setSubject(notificationEmail.getSubject());
			// messageHelper.setText(mailContentBuilder.build(notificationEmail.getBody()));
		};

		try {
			mailSender.send(messagePreparator);
			log.info(" email sent!!");
		} catch (MailException e) {
			log.error("Exception occurred when sending mail", e);
			throw new MasterException("Exception occurred when sending mail to " + notificationEmail.getRecipient(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}

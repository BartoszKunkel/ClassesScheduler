package com.kunkel.diploma.models.dto;

public record SignUpDto (String firstName, String lastName, String login, Long accesslvl, char[] password) {
}

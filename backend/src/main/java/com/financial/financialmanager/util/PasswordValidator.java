package com.financial.financialmanager.util;

import java.util.regex.Pattern;

public class PasswordValidator {
    private static final Pattern UPPER_CASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWER_CASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[@#$%!\\*\\-_]");

    public static String validate(String password) {
        if (password == null || password.trim().isEmpty()) {
            return "Mật khẩu không được để trống";
        }
        String pwd = password;
        if (pwd.length() < 8) {
            return "Mật khẩu phải có ít nhất 8 ký tự.";
        }
        if (!UPPER_CASE.matcher(pwd).find()) {
            return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
        }
        if (!LOWER_CASE.matcher(pwd).find()) {
            return "Mật khẩu phải chứa ít nhất một chữ cái viết thường.";
        }
        if (!DIGIT.matcher(pwd).find()) {
            return "Mật khẩu phải chứa ít nhất một chữ số.";
        }
        if (!SPECIAL.matcher(pwd).find()) {
            return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
        }
        return null;
    }

    public static boolean isValid(String password) {
        return validate(password) == null;
    }
}

package com.example.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Properties;

import net.bytebuddy.asm.Advice.This;

public class LoadConfig {
	
    private static String value;
    
    public static String getValue(String key) {
        Properties properties = new Properties();
        InputStream inputStream  =  LoadConfig.class.getClassLoader().getResourceAsStream("application.properties");
        try {
            properties.load(inputStream);
            inputStream.close();
            value = new String(properties.getProperty(key).getBytes("ISO-8859-1"), "UTF-8");
            return value;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return value;
    }
}
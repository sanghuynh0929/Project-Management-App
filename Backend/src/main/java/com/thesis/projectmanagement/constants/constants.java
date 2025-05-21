package com.thesis.projectmanagement.constants;

public final class constants {
    //i want to restrict tje instantiation of this class
    private constants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
    // write a template to generate a class with constants
    public static final String SAMPLE_CONSTANT = "Sample Constant";
}

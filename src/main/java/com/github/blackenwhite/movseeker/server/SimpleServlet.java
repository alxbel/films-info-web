package com.github.blackenwhite.movseeker.server;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class SimpleServlet extends HttpServlet {
    @Override
    public void doPost(HttpServletRequest request,
                       HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        PrintWriter out = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), "UTF-8"), true);

        ServerMoviesProcessor serverMoviesProcessor = new ServerMoviesProcessor(request);
        int status = serverMoviesProcessor.initIMDBContent();
        if (status != HttpServletResponse.SC_OK) {
            response.sendError(status);
            return;
        }
        serverMoviesProcessor.initMovieObjects();
        serverMoviesProcessor.updateMoviesWithOMDBData();
        String jsonString = serverMoviesProcessor.getAllMoviesAsJSON();
        System.out.println("json="+jsonString);
        if (jsonString.equals("[]")) {
            System.out.println("nothing");
        }
        out.print(jsonString);

        out.flush();
        out.close();
    }
}

<%@page import="java.io.*, java.util.*, lyj.jpa.service.*, lyj.jpa.model.*"
contentType="text/html; charset=utf8"%>
<%
//XML만으로 매핑구문과 결과매핑 처리
//CommentMapperDynamicSql.xml의 selectCommentByPrimaryKey매핑구문
Long commentNo = Long.parseLong(request.getParameter("commentNo"));
CommentService commentService = new CommentService();
Comment comment = commentService.selectCommentByPrimaryKey(commentNo);
%>
댓글번호 : <%= comment.getCommentNo() %><br>
작성자아이디 : <%= comment.getUserId() %><br>
작성일시 : <%= comment.getRegDate() %><br>
댓글내용 : <%= comment.getCommentContent() %><br>et=utf8"%>
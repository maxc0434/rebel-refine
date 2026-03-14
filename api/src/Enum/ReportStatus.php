<?php
namespace App\Enum;

enum ReportStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case RESOLVED = 'resolved';
    case REJECTED = 'rejected';
}